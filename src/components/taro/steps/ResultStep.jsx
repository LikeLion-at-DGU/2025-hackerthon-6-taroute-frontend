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
  DetailHeartButton,
  DetailHeartSvg,
  TaroButton,
  ExitModalOverlay,
  ExitModal,
  ExitModalHeader,
  ExitModalContent,
  ExitModalTitle,
  ExitModalDescription,
  ExitModalFooter,
  ExitModalButton,
} from '../styles/ResultStep.style.js'
import { useTranslation } from "react-i18next";


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
import { fetchPlaceSummary } from '../../../apis/taroApi'

import { useNavigate } from 'react-router-dom'
import SadTaruIcon from '../../../assets/icons/taru/SadTaru.svg'

function ResultStep({ prev, goTo }) {
  const { t } = useTranslation();
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
  const goPrev = () => setDetailIndex(i => (i === null ? i : Math.max(0, i - 1)))
  const goNext = () => setDetailIndex(i => (i === null ? i : Math.min(cards.length - 2, i + 1))) // retry 제외
  
  const [showExitModal, setShowExitModal] = useState(false)
  const openExitModal = () => setShowExitModal(true)
  const closeExitModal = () => setShowExitModal(false)

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
        
        const finalCards = [...mapped, { id: 'VIII', title: '다시 뽑기', img: undefined, liked: false, isRetry: true }]
        setCards(finalCards)
        
        // 처리된 카드 데이터를 sessionStorage에 저장하여 뒤로가기 시에도 동일한 결과 유지
        sessionStorage.setItem('taro_processed_cards', JSON.stringify(finalCards))
        
        return true
      } catch {
        return false
      }
    }

    // 이미 처리된 카드가 있다면 그것을 사용 (뒤로가기 시 동일한 결과 유지)
    const processedCards = sessionStorage.getItem('taro_processed_cards')
    if (processedCards) {
      try {
        const parsed = JSON.parse(processedCards)
        setCards(parsed)
        return
      } catch {}
    }

    // 이미 카드가 로드되어 있다면 다시 로드하지 않음
    if (cards[0].title !== '로딩 중') return

    const rawNow = sessionStorage.getItem('taro_selected_result')
    if (rawNow && applyFromStorage(rawNow)) return

    // 데이터 폴링: 더 빠른 간격으로 체크하여 결과 화면 진입 시 바로 표시
    let attempts = 40
    const timer = setInterval(() => {
      const raw = sessionStorage.getItem('taro_selected_result')
      if (raw && applyFromStorage(raw)) {
        clearInterval(timer)
      } else if (--attempts <= 0) {
        clearInterval(timer)
      }
    }, 150)

    return () => clearInterval(timer)
  }, []) // 의존성 배열을 빈 배열로 유지하여 컴포넌트 마운트 시에만 실행

  // 디테일 카드가 열릴 때 /chats/place_summary로 요약을 로드하여 카드에 주입
  useEffect(() => {
    const loadSummary = async () => {
      if (detailIndex === null) return
      const target = cards[detailIndex]
      if (!target || target.isRetry) return
      if (target.summary && target.summary.length > 0) return
      const placeId = target.place_id || target.google_place_id || target.id
      if (!placeId) return
      try {
        const summary = await fetchPlaceSummary({ place_id: placeId, lang: 'ko' })
        if (summary) {
          setCards(prev => prev.map((c, i) => i === detailIndex ? { ...c, summary } : c))
        }
      } catch {}
    }
    loadSummary()
  }, [detailIndex, cards])

  return (
    <Wrapper>
      <Overlay />
      <Content>
        <Title>{t("taro.card")}</Title>

        <Grid>
          {pageCards.map((c, idx) => (
            <Card
              key={c.id}
              bg={c.isRetry ? retryCard : cardBg}
              isRetry={!!c.isRetry}
              onClick={() => {
                if (c.isRetry) {
                  if (typeof goTo === 'function') {
                    goTo(0)
                  } else {
                    // goTo 함수가 없으면 기본 동작 (타로 페이지로 이동)
                    window.location.href = '/taro'
                  }
                } else {
                  openDetail(page * pageSize + idx)
                }
              }}
              style={{ cursor: c.isRetry ? 'pointer' : 'default' }}
            >
              {c.isRetry ? (
                // 다시 뽑기 카드 - 고대 숫자와 제목 제거
                <>
                  {/* 고대 숫자와 제목 제거 */}
                </>
              ) : (
                // 일반 카드
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
                        const newCards = cards.map((card, i) => i === globalIndex ? { ...card, liked: !card.liked } : card)
                        setCards(newCards)
                        // 찜 상태를 sessionStorage에 반영
                        sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
                        return
                      }
                      // 토글 동작: 이미 찜 상태면 해제, 아니면 저장
                      if (target.liked) {
                        try {
                          removePlace(target.place_id)
                          const newCards = cards.map((card, i) => i === globalIndex ? { ...card, liked: false } : card)
                          setCards(newCards)
                          // 찜 상태를 sessionStorage에 반영
                          sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
                          showToast('찜을 해제했어요.')
                        } catch {
                          // 로컬 해제만 수행
                          const newCards = cards.map((card, i) => i === globalIndex ? { ...card, liked: false } : card)
                          setCards(newCards)
                          // 찜 상태를 sessionStorage에 반영
                          sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
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
                        const newCards = cards.map((card, i) => i === globalIndex ? { ...card, liked: true } : card)
                        setCards(newCards)
                        // 찜 상태를 sessionStorage에 반영
                        sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
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

        <Instruction>{t("taro.carddetail")}</Instruction>
      </Content>

      <TaroButton onClick={openExitModal}>
        {t("taro.endtaro")}
      </TaroButton>

      {detailIndex !== null && cards[detailIndex] && !cards[detailIndex].isRetry && (
        <DetailOverlay onClick={closeDetail}>
          <DetailCard onClick={(e) => e.stopPropagation()} bg={detailCardBg}>
            {/* 뒤로가기 버튼 추가 */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 10,
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }} onClick={(e) => {
              e.stopPropagation()
              closeDetail()
            }}>
              ←
            </div>
            
            <DetailInner>
              <DetailImage src={cards[detailIndex].img} alt={cards[detailIndex].title} />
              <DetailTitle>{cards[detailIndex].title}</DetailTitle>
              <DetailDesc>{cards[detailIndex].summary}</DetailDesc>
              <DetailFooter>
                <SmallButton onClick={() => {
                  const target = cards[detailIndex]
                  const rawId = target?.place_id || target?.google_place_id || target?.id
                  if (!rawId) {
                    showToast('해당 장소의 상세 정보를 찾을 수 없어요.')
                    return
                  }

                  
                  // 방법 1: 현재 페이지를 히스토리에 추가
                  window.history.pushState({ from: 'taro_result' }, '', window.location.pathname)
                  
                  // 방법 2: replace 대신 push 사용하여 히스토리 스택 유지
                  navigate(`/wiki/place/${encodeURIComponent(rawId)}`, { replace: false })
                
                }}>{t("taro.gowiki")}</SmallButton>
                
                <DetailHeartButton onClick={async (e) => {

                  e.stopPropagation()
                  const idx = detailIndex
                  const target = cards[idx]
                  if (!target?.place_id) {
                    // UI 토글만 수행
                    const newCards = cards.map((card, i) => i === idx ? { ...card, liked: !card.liked } : card)
                    setCards(newCards)
                    // 찜 상태를 sessionStorage에 반영
                    sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
                    return
                  }
                  // 토글 동작: 이미 찜 상태면 해제, 아니면 저장
                  if (target.liked) {
                    try {
                      removePlace(target.place_id)
                      const newCards = cards.map((card, i) => i === idx ? { ...card, liked: false } : card)
                      setCards(newCards)
                      // 찜 상태를 sessionStorage에 반영
                      sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
                      showToast('찜을 해제했어요.')
                    } catch {
                      // 로컬 해제만 수행
                      const newCards = cards.map((card, i) => i === idx ? { ...card, liked: false } : card)
                      setCards(newCards)
                      // 찜 상태를 sessionStorage에 반영
                      sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
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
                    const newCards = cards.map((card, i) => i === idx ? { ...card, liked: true } : card)
                    setCards(newCards)
                    // 찜 상태를 sessionStorage에 반영
                    sessionStorage.setItem('taro_processed_cards', JSON.stringify(newCards))
                    showToast('장소가 저장되었습니다.')
                  } catch (e) {
                    showToast('저장 중 오류가 발생했어요.')
                  }
                }}>
                  <DetailHeartSvg src={(cards[detailIndex]?.liked ? blackHeartIcon : heartIcon)} alt="찜" />
                </DetailHeartButton>
              </DetailFooter>
            </DetailInner>
            <DetailPager>{`${detailIndex + 1} / 7`}</DetailPager>
            <ChevronLeft onClick={(e)=>{ e.stopPropagation(); goPrev(); }}>{'‹'}</ChevronLeft>
            <ChevronRight onClick={(e)=>{ e.stopPropagation(); goNext(); }}>{'›'}</ChevronRight>
          </DetailCard>
        </DetailOverlay> 
      )}

      {/* 타로 종료 확인 모달 */}
      {showExitModal && (
        <ExitModalOverlay onClick={closeExitModal}>
          <ExitModal onClick={(e) => e.stopPropagation()}>
            <ExitModalHeader>           
            </ExitModalHeader>
            <ExitModalContent>
              <ExitModalTitle>{t("taro.ending")}</ExitModalTitle>
              <ExitModalDescription>{t("taro.ending2")}</ExitModalDescription>
            </ExitModalContent>
            <ExitModalFooter>
              <ExitModalButton onClick={closeExitModal}>{t("taro.return")}</ExitModalButton>
              <ExitModalButton $primary onClick={() => {
                closeExitModal()
                navigate('/plan')
              }}>{t("taro.close")}</ExitModalButton>
            </ExitModalFooter>
          </ExitModal>
        </ExitModalOverlay>
      )}
      
    </Wrapper>
  )
}

export default ResultStep


