import styled from 'styled-components'
import { useEffect, useState, useMemo } from 'react'
import { fetchCategoryPlaces } from '../../apis/categoryApi.js'
import timeIcon from '../../assets/icons/time.svg'
import { useSavedPlaceContext } from '../../contexts/SavedPlaceContext.jsx'

export function PlaceList({ query }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCategoryPlaces(query)
      .then((res) => {
        if (!cancelled) setItems(res)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [JSON.stringify(query)])

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
  const { savedPlaces, addPlace, removePlace } = useSavedPlaceContext()
  const liked = useMemo(() => {
    return savedPlaces.some(p => {
      if (p.id && place.id) return p.id === place.id
      const pName = p.place_name || p.name
      const pAddr = p.address || p.address_name || p.location
      return pName === place.name && pAddr === place.location
    })
  }, [savedPlaces, place])

  const toggleLike = () => {
    const normalized = {
      id: place.id,
      name: place.name,
      place_name: place.name,
      address: place.location,
      address_name: place.location,
      location: place.location,
      place_photos: place.images,
    }
    if (liked) removePlace(normalized)
    else addPlace(normalized)
  }

  return (
    <Card>
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
          <Text $ml="-4px">{place.location}</Text>
        </Row>
        <Row>
          <IconTime src={timeIcon} alt="시간" />
          <Text>{place.time}</Text>
        </Row>
      </Info>
      <FavButton onClick={toggleLike} aria-label={liked ? '찜 해제' : '찜하기'} $active={liked}>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.59C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={liked ? '#E35A5A' : '#ffffff99'} />
        </svg>
      </FavButton>
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
    <path d="M9.55769 7.24998C9.55769 7.59681 9.41992 7.92942 9.17468 8.17466C8.92944 8.4199 8.59682 8.55768 8.25 8.55768C7.90318 8.55768 7.57056 8.4199 7.32532 8.17466C7.08008 7.92942 6.94231 7.59681 6.94231 7.24998C6.94231 6.90316 7.08008 6.57055 7.32532 6.32531C7.57056 6.08007 7.90318 5.94229 8.25 5.94229C8.59682 5.94229 8.92944 6.08007 9.17468 6.32531C9.41992 6.57055 9.55769 6.90316 9.55769 7.24998Z" fill="currentColor"/>
    <path d="M7.72235 12.9136C7.09405 12.474 6.51023 11.974 5.97919 11.4209C5.04615 10.4447 4 8.97939 4 7.24997C4 5.1217 5.72681 2.99997 8.25 2.99997C10.7732 2.99997 12.5 5.1217 12.5 7.24997C12.5 8.97939 11.4538 10.4447 10.5208 11.4209C9.98977 11.974 9.40595 12.474 8.77765 12.9136C8.60569 13.0332 8.42719 13.1431 8.25 13.2555C8.07346 13.1431 7.89431 13.0332 7.72235 12.9136ZM8.25 4.30766C6.52319 4.30766 5.30769 5.76705 5.30769 7.24997C5.30769 8.46285 6.05962 9.61297 6.92465 10.5166C7.33278 10.9421 7.77614 11.3323 8.25 11.683C8.72383 11.3325 9.1672 10.9425 9.57535 10.5172C10.4404 9.61297 11.1923 8.46351 11.1923 7.24997C11.1923 5.76705 9.97681 4.30766 8.25 4.30766Z" fill="currentColor"/>
  </svg>
))`
  margin-left: -3px; /* 위치 아이콘만 좌측으로 살짝 이동 */
  color: #8A8A8A;
`

const IconTime = styled(IconBase)`
  width: 10px; /* 시계 아이콘이 시각적으로 더 커 보여 살짝 축소 */
  height: 10px;
  
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

const FavButton = styled.button`
  position: absolute;
  right: 14px;
  bottom: 14px;
  width: 44px;
  height: 44px;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  border-radius: 12px;
  background: ${p => (p.$active ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.55)')};
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
`

const Empty = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #888;
`


