import {
  Wrapper,
  Overlay,
  Content,
  Title,
  Grid,
  Card,
  CardBadge,
  CardImage,
  CardFooter,
  FooterLabel,
  HeartButton,
  HeartSvg,
  ChevronRight,
  ChevronLeft,
  Instruction,
  DetailOverlay,
  DetailCard,
  DetailInner,
  DetailImage,
  DetailTitle,
  DetailDesc,
  DetailFooter,
  SmallButton,
  DetailPager,
} from '../styles/ResultStep.style.js'
import PrimaryButton from '../../common/PrimaryButton.jsx'
import sampleImg from '../../../assets/images/ads_temp/temp1.jpg'
import cardBg from '../../../assets/icons/taro/ResultTaroCard.svg'
import { useEffect, useMemo, useState } from 'react'
import heartIcon from '../../../assets/icons/Heart.svg'
import blackHeartIcon from '../../../assets/icons/BlackHeart.svg'
import retryCard from '../../../assets/icons/taro/RetryCard.svg'
import detailCardBg from '../../../assets/icons/taro/ResultDetailCard.svg'
import { savePlaceToServer } from '../../../apis/savePlaceApi'
import { showToast } from '../../../hooks/common/toast'
import { useSavedPlaceContext } from '../../../contexts/SavedPlaceContext'

import { useNavigate } from 'react-router-dom'

function ResultStep({ prev, goTo }) {
  const navigate = useNavigate()
  const { addPlace, removePlace } = useSavedPlaceContext()
  const [cards, setCards] = useState(() => ([
    { id: 'I', title: '로딩 중', img: sampleImg, liked: false, desc: '' },
    { id: 'II', title: '로딩 중', img: sampleImg, liked: false, desc: '' },
    { id: 'III', title: '로딩 중', img: sampleImg, liked: false, desc: '' },
    { id: 'IV', title: '로딩 중', img: sampleImg, liked: false, desc: '' },
    { id: 'V', title: '로딩 중', img: sampleImg, liked: false, desc: '' },
    { id: 'VI', title: '로딩 중', img: sampleImg, liked: false, desc: '' },
    { id: 'VII', title: '로딩 중', img: sampleImg, liked: false, desc: '' },
    { id: 'VIII', title: '다시 뽑기', img: undefined, liked: false, isRetry: true },
  ]))

  const [page, setPage] = useState(0)
  const pageSize = 4
  const maxPage = Math.ceil(cards.length / pageSize) - 1
  const pageCards = useMemo(() => {
    const start = page * pageSize
    return cards.slice(start, start + pageSize)
  }, [page, cards])

  const [detailIndex, setDetailIndex] = useState(null) // 0..6 중 하나, retry는 제외
  const openDetail = (globalIndex) => setDetailIndex(globalIndex)
  const closeDetail = () => setDetailIndex(null)

  // 세션에 저장된 20장 추천 결과 중 7장을 무작위로 골라 카드 타이틀/desc를 채움
  useEffect(() => {
    const applyFromStorage = (raw) => {
      try {
        const parsed = JSON.parse(raw)
        const select = Array.isArray(parsed) ? parsed : (parsed?.select || parsed?.data?.select || [])
        const shuffled = Array.isArray(select) ? [...select] : []
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        const picked = shuffled.slice(0, 7)
        if (picked.length === 0) return false
        const mapped = picked.map((item, i) => ({
          id: ['I','II','III','IV','V','VI','VII'][i] || `${i+1}`,
          title: item.place_name || '추천 장소',
          img: (Array.isArray(item.place_photos) && item.place_photos.length > 0) ? item.place_photos[0] : sampleImg,
          liked: false,
          desc: item.address || item.place_id || '',
          place_id: item.place_id,
          address: item.address,
          place_photos: item.place_photos,
        }))
        setCards(prev => {
          const stableRetry = prev.find(c => c.isRetry)
          return [...mapped, stableRetry || { id: 'VIII', title: '다시 뽑기', isRetry: true }]
        })
        return true
      } catch {
        return false
      }
    }

    const rawNow = sessionStorage.getItem('taro_selected_result')
    if (rawNow && applyFromStorage(rawNow)) return

    // 데이터가 아직 없으면 잠시 폴링 (최대 ~6초)
    let attempts = 20
    const timer = setInterval(() => {
      const raw = sessionStorage.getItem('taro_selected_result')
      if (raw && applyFromStorage(raw)) {
        clearInterval(timer)
      } else if (--attempts <= 0) {
        clearInterval(timer)
      }
    }, 300)

    return () => clearInterval(timer)
  }, [])

  return (
    <Wrapper>
      <Overlay />
      <Content>
        <Title>운명의 카드</Title>

        <Grid>
          {pageCards.map((c, idx) => (
            <Card
              key={c.id}
              bg={c.isRetry ? retryCard : cardBg}
              isRetry={!!c.isRetry}
              onClick={() => {
                if (c.isRetry) {
                  if (typeof goTo === 'function') goTo(0)
                } else {
                  openDetail(page * pageSize + idx)
                }
              }}
              style={{ cursor: c.isRetry ? 'pointer' : 'default' }}
            >
              {!c.isRetry && (
                <>
                  <CardBadge>{c.id}</CardBadge>
                  <CardImage src={c.img} alt={c.title} />
                  <CardFooter>
                    <FooterLabel>{c.title}</FooterLabel>
                  <HeartButton
                    onClick={async (e) => {
                      e.stopPropagation()
                      const globalIndex = page * pageSize + idx
                      const target = cards[globalIndex]
                      if (!target?.place_id) {
                        // UI 토글만 수행
                        setCards(prev => prev.map((card, i) => i === globalIndex ? { ...card, liked: !card.liked } : card))
                        return
                      }
                      // 토글 동작: 이미 찜 상태면 해제, 아니면 저장
                      if (target.liked) {
                        try {
                          removePlace(target.place_id)
                          setCards(prev => prev.map((card, i) => i === globalIndex ? { ...card, liked: false } : card))
                          showToast('찜을 해제했어요.')
                        } catch {
                          // 로컬 해제만 수행
                          setCards(prev => prev.map((card, i) => i === globalIndex ? { ...card, liked: false } : card))
                          showToast('찜을 해제했어요.')
                        }
                        return
                      }
                      try {
                        const res = await savePlaceToServer(target.place_id)
                        const placeData = res?.data ?? res
                        if (placeData) {
                          const toSave = { ...placeData, id: placeData.id || target.place_id }
                          try { addPlace(toSave) } catch {}
                        }
                        setCards(prev => prev.map((card, i) => i === globalIndex ? { ...card, liked: true } : card))
                        showToast('장소가 저장되었습니다.')
                      } catch (e) {
                        showToast('저장 중 오류가 발생했어요.')
                      }
                    }}
                  >
                  <HeartSvg
                    src={c.liked ? blackHeartIcon : heartIcon}
                    alt={c.liked ? '찜 취소' : '찜'}
                  />
                  </HeartButton>
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
          {page > 0 && (
            <ChevronLeft onClick={() => setPage(p => Math.max(0, p - 1))}>{'‹'}</ChevronLeft>
          )}
          {page < maxPage && (
            <ChevronRight onClick={() => setPage(p => Math.min(maxPage, p + 1))}>{'›'}</ChevronRight>
          )}
        </Grid>

        <Instruction>카드를 눌러 자세히 확인해보세요</Instruction>
      </Content>

      <PrimaryButton
        fixedBottom
        bottomOffset="50px"
        onClick={() => navigate('/plan')}
        zIndex={1200}
      >
        타로 종료하기
      </PrimaryButton>

      {detailIndex !== null && cards[detailIndex] && !cards[detailIndex].isRetry && (
        <DetailOverlay onClick={closeDetail}>
          <DetailCard onClick={(e) => e.stopPropagation()} bg={detailCardBg}>
            <DetailInner>
              <DetailImage src={cards[detailIndex].img} alt={cards[detailIndex].title} />
              <DetailTitle>{cards[detailIndex].title}</DetailTitle>
              <DetailDesc>{cards[detailIndex].desc}</DetailDesc>
              <DetailFooter>
                <SmallButton onClick={() => {
                  const target = cards[detailIndex]
                  const rawId = target?.place_id || target?.google_place_id || target?.id
                  if (!rawId) {
                    showToast('해당 장소의 상세 정보를 찾을 수 없어요.')
                    return
                  }
                  navigate(`/wiki/place/${encodeURIComponent(rawId)}`)
                }}>지역위키 확인하기</SmallButton>
              </DetailFooter>
            </DetailInner>
            <DetailPager>{`${detailIndex + 1} / 7`}</DetailPager>
          </DetailCard>
        </DetailOverlay> 
      )}

      
    </Wrapper>
  )
}

export default ResultStep


