import styled from 'styled-components'
import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategoryPlaces } from '../../apis/categoryApi.js'
import { searchWikiPlaces } from '../../apis/wikiApi.js'
import timeIcon from '../../assets/icons/time.svg'
import runningArrow from '../../assets/icons/arrow-down.svg'
import { useSavedPlaceContext } from '../../contexts/SavedPlaceContext.jsx'

export function PlaceList({ query, itemsOverride }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (Array.isArray(itemsOverride)) {
      setItems(itemsOverride)
      setLoading(false)
      return () => { cancelled = true }
    }
    setLoading(true)
    fetchCategoryPlaces(query)
      .then(async (res) => {
        if (cancelled) return
        // 1차: 카테고리 검색 결과
        if (Array.isArray(res) && res.length > 0) {
          setItems(res)
          return
        }
        // 2차: fallback - 검색어가 있을 때만 위키 검색으로 보완 (상위 5)
        const kw = (query?.keyword || '').trim()
        if (!kw) { setItems([]); return }
        try {
          const distLabel = query?.distance || 'all'
          const toRadius = (label) => {
            if (!label) return 20000
            if (label.includes('1km')) return 1000
            if (label.includes('3km')) return 3000
            if (label.includes('5km')) return 5000
            return 20000
          }
          const radius = toRadius(distLabel)
          const rankPreference = distLabel === 'all' ? 'RELEVANCE' : 'DISTANCE'
          const wiki = await searchWikiPlaces({
            latitude: query?.y,
            longitude: query?.x,
            place_name: kw,
            radius,
            rankPreference,
          })
          if (cancelled) return
          const mapped = (wiki || []).slice(0, 5).map(p => ({
            id: p.place_id,
            name: p.place_name,
            images: [],
            distance: p.distance_text,
            address: p.address,
            time: Array.isArray(p.running_time) && p.running_time.length ? p.running_time[0] : '',
          }))
          setItems(mapped)
        } catch {
          setItems([])
        }
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [JSON.stringify(query), Array.isArray(itemsOverride) ? JSON.stringify(itemsOverride.map(i => i.id)) : ''])

  if (loading) return <Empty>불러오는 중...</Empty>
  if (!items.length) return <Empty>결과가 없어요</Empty>

  return (
    <List>
      {items.map((p) => (
        <PlaceCard key={p.id} place={p} />
      ))}
    </List>
  )
}

function PlaceCard({ place }) {
  const navigate = useNavigate()
  const { savedPlaces, addPlace, removePlace } = useSavedPlaceContext()
  const liked = useMemo(() => {
    return savedPlaces.some(p => {
      if (p.id && place.id) return p.id === place.id
      const pName = p.place_name || p.name
      const pAddr = p.address || p.address_name || p.location
      return pName === place.name && pAddr === place.location
    })
  }, [savedPlaces, place])

  // 영업시간 모달 상태 및 유틸들 (PLAN과 동일한 UX)
  const [showTimeModal, setShowTimeModal] = useState(false)
  const selectedDay = new Date().getDay()

  let todaysRunningTime = ''
  if (place?.running_time) {
    if (Array.isArray(place.running_time)) {
      todaysRunningTime = place.running_time[selectedDay] || ''
    } else if (typeof place.running_time === 'string') {
      todaysRunningTime = place.running_time === '영업시간 정보 없음' ? '' : place.running_time
    }
  }

  const getRunningTimeData = () => {
    if (!place?.running_time || !Array.isArray(place.running_time)) {
      return Array(7).fill('정보없음')
    }
    return place.running_time.map((time) => {
      if (!time || time === '정보없음') return '정보없음'
      if (time.includes('휴무일')) return '휴무일'
      
      // "월요일 24시간 영업" 형태에서 "24시간 영업"만 추출
      if (time.includes('24시간 영업')) {
        return time.replace(/^[가-힣]+요일\s*/, '');
      }
      
      const m = time.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/)
      return m ? m[0] : time
    })
  }

  const isHoliday = (timeText) => timeText === '휴무일';

  const getBreakTime = () => {
    if (!place?.running_time || !Array.isArray(place.running_time)) return '정보없음'
    const entry = place.running_time.find((t) => t && t.includes('쉬는 시간'))
    if (entry) {
      const m = entry.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/)
      return m ? m[0] : '정보없음'
    }
    return '정보없음'
  }



  const handleTimeClick = () => {
    setShowTimeModal(true)
    document.addEventListener('keydown', handleKeyDown)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setShowTimeModal(false)
  }
  const handleCloseModal = (e) => {
    if (e.target.closest('[data-modal-container]')) return
    setShowTimeModal(false)
  }
  useEffect(() => {
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleLike = (e) => {
    e.stopPropagation()
    const normalized = {
      id: place.id,
      name: place.name,
      place_name: place.name,
      address: place.address || place.location,
      address_name: place.address || place.location,
      location: place.address || place.location,
      place_photos: place.images,
      running_time: place.running_time,
    }
    if (liked) removePlace(normalized)
    else addPlace(normalized)
  }

  return (
    <Card onClick={() => navigate(`/wiki/place/${encodeURIComponent(place.id)}`)} role="button">
      <Gallery>
        <ThumbList>
          {(place.images || []).map((src, i) => (
            <ThumbItem key={i}>
              <Slide src={src} alt={`${place.name} ${i + 1}`} />
            </ThumbItem>
          ))}
        </ThumbList>
      </Gallery>
      <Info>
        <Name>{place.name}</Name>
        <Row>
          <IconMap />
          <Text $ml="-4px">{place.distance || place.location}</Text>
        </Row>
        <RunningTimeContainer onClick={(e) => { e.stopPropagation(); handleTimeClick(); }}>
          <IconTime src={timeIcon} alt="시간" />
          <Text>{todaysRunningTime || '영업시간 정보 미제공'}</Text>
          <ArrowImg src={runningArrow} alt="상세 시간" />
        </RunningTimeContainer>
      </Info>
      <FavButton onClick={toggleLike} aria-label={liked ? '찜 해제' : '찜하기'} $active={liked}>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.59C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={liked ? '#E35A5A' : '#ffffff99'} />
        </svg>
      </FavButton>

      {showTimeModal && (
        <>
          <ModalOverlay onClick={handleCloseModal} />
          <ModalContainer data-modal-container>
            <TimeList>
              <TimeItem>
                <DayLabel>월요일</DayLabel>
                <TimeText $isHoliday={isHoliday(getRunningTimeData()[1])}>{getRunningTimeData()[1]}</TimeText>
              </TimeItem>
              <TimeItem>
                <DayLabel>금요일</DayLabel>
                <TimeText $isHoliday={isHoliday(getRunningTimeData()[5])}>{getRunningTimeData()[5]}</TimeText>
              </TimeItem>
              <TimeItem>
                <DayLabel>화요일</DayLabel>
                <TimeText $isHoliday={isHoliday(getRunningTimeData()[2])}>{getRunningTimeData()[2]}</TimeText>
              </TimeItem>
              <TimeItem>
                <DayLabel>토요일</DayLabel>
                <TimeText $isHoliday={isHoliday(getRunningTimeData()[6])}>{getRunningTimeData()[6]}</TimeText>
              </TimeItem>
              <TimeItem>
                <DayLabel>수요일</DayLabel>
                <TimeText $isHoliday={isHoliday(getRunningTimeData()[3])}>{getRunningTimeData()[3]}</TimeText>
              </TimeItem>
              <TimeItem>
                <DayLabel>일요일</DayLabel>
                <TimeText $isHoliday={isHoliday(getRunningTimeData()[0])}>{getRunningTimeData()[0]}</TimeText>
              </TimeItem>
              <TimeItem>
                <DayLabel>목요일</DayLabel>
                <TimeText $isHoliday={isHoliday(getRunningTimeData()[4])}>{getRunningTimeData()[4]}</TimeText>
              </TimeItem>
            </TimeList>
            <BreakTimeSection>
              <BreakTimeLabel>쉬는시간</BreakTimeLabel>
              <BreakTimeText>{getBreakTime()}</BreakTimeText>
            </BreakTimeSection>
          </ModalContainer>
        </>
      )}
    </Card>
  )
}

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`

const Card = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
`

const Gallery = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #f4f4f4;
`

const ThumbList = styled.div`
  display: flex;
  gap: 10px;
  padding: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
  &::-webkit-scrollbar {
        display: none;
    }

    scrollbar-width: none; 
    -ms-overflow-style: none;

`

const ThumbItem = styled.div`
  width: 130px;
  height: 130px;
  flex: 0 0 130px; /* 가로 스크롤에서 고정 폭 유지 */
  border-radius: 8px;
  overflow: hidden;
  scroll-snap-align: start;
`

const Slide = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
`

const Name = styled.div`
  margin-bottom: 5px;

  color: var(--color-neutral-black, #2A2A2A);
  font-size: 15px;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: -0.5px;
`

const Meta = styled.div`
  color: #666;
  font-size: 12px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconBase = styled.img`
  display: block;
  object-fit: contain;
`

const IconMap = styled(({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.55769 7.24998C9.55769 7.59681 9.41992 7.92942 9.17468 8.17466C8.92944 8.4199 8.59682 8.55768 8.25 8.55768C7.90318 8.55768 7.57056 8.4199 7.32532 8.17466C7.08008 7.92942 6.94231 7.59681 6.94231 7.24998C6.94231 6.90316 7.08008 6.57055 7.32532 6.32531C7.57056 6.08007 7.90318 5.94229 8.25 5.94229C8.59682 5.94229 8.92944 6.08007 9.17468 6.32531C9.41992 6.57055 9.55769 6.90316 9.55769 7.24998Z" fill="currentColor" />
    <path d="M7.72235 12.9136C7.09405 12.474 6.51023 11.974 5.97919 11.4209C5.04615 10.4447 4 8.97939 4 7.24997C4 5.1217 5.72681 2.99997 8.25 2.99997C10.7732 2.99997 12.5 5.1217 12.5 7.24997C12.5 8.97939 11.4538 10.4447 10.5208 11.4209C9.98977 11.974 9.40595 12.474 8.77765 12.9136C8.60569 13.0332 8.42719 13.1431 8.25 13.2555C8.07346 13.1431 7.89431 13.0332 7.72235 12.9136ZM8.25 4.30766C6.52319 4.30766 5.30769 5.76705 5.30769 7.24997C5.30769 8.46285 6.05962 9.61297 6.92465 10.5166C7.33278 10.9421 7.77614 11.3323 8.25 11.683C8.72383 11.3325 9.1672 10.9425 9.57535 10.5172C10.4404 9.61297 11.1923 8.46351 11.1923 7.24997C11.1923 5.76705 9.97681 4.30766 8.25 4.30766Z" fill="currentColor" />
  </svg>
))`
  margin-left: -3px; /* 위치 아이콘만 좌측으로 살짝 이동 */
  color: #8A8A8A;
`

const IconTime = styled(IconBase)`
  width: 10px; /* 시계 아이콘이 시각적으로 더 커 보여 살짝 축소 */
  height: 10px;
  
`

const ArrowImg = styled(IconBase)`
  width: 12px;
  height: 12px;
`

const Text = styled.span`
  color: #2A2A2A;

  color: var(--color-neutral-black, #2A2A2A);
  font-size: 10px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: -0.5px;
  margin-left: ${p => p.$ml || '0'};
`

const RunningTimeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const FavButton = styled.button`
  position: absolute;
  right: 14px;
  bottom: 17px;
  width: 32px;
  height: 32px;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  border-radius:5px;
  background: ${p => (p.$active ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.55)')};
  transition: all 0.2s ease;
    
    &:hover {
        background: rgba(139, 139, 139, 0.9);
        transform: scale(1.05);
    }
    
    &:active {
        transform: scale(0.95);
    }
`

const Empty = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #888;
`

// 영업시간 모달 스타일 (PLAN 컴포넌트와 동일한 크기/타이포 사용)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
`

const ModalContainer = styled.div`
  background: #F0F0F0;
  border-radius: 12px;
  padding: 12px 14px 14px 14px;
  width: 253px;
  height: 125px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2001;
`

const TimeList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px 12px;
  margin-bottom: 8px;
`

const TimeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 0;
`

const DayLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  min-width: 24px;
`

const TimeText = styled.span`
  font-size: 11px;
  font-weight: 300;
  color: ${props => props.$isHoliday ? '#F03F40' : '#6B7280'};
  text-align: right;
`

const BreakTimeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BreakTimeLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #F03F40;
`

const BreakTimeText = styled.span`
  font-size: 11px;
  color: #6B7280;
`

