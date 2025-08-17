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
import { useState, useMemo } from 'react'
import heartIcon from '../../../assets/icons/Heart.svg'
import blackHeartIcon from '../../../assets/icons/BlackHeart.svg'
import retryCard from '../../../assets/icons/taro/RetryCard.svg'
import detailCardBg from '../../../assets/icons/taro/ResultDetailCard.svg'

function ResultStep({ prev, goTo }) {
  const [cards, setCards] = useState(() => ([
    { id: 'I', title: '진아네 떡볶이', img: sampleImg, liked: false, desc: '충무로에 위치한 떡볶이 노포로 떡볶이가 대표 메뉴이다' },
    { id: 'II', title: '진아네 떡볶이', img: sampleImg, liked: false, desc: '쫄깃한 떡과 매콤한 양념이 특징이에요' },
    { id: 'III', title: '진아네 떡볶이', img: sampleImg, liked: false, desc: '근처 직장인들이 즐겨 찾는 숨은 맛집' },
    { id: 'IV', title: '진아네 떡볶이', img: sampleImg, liked: false, desc: '김밥과 함께 먹으면 더 맛있어요' },
    { id: 'V', title: '진아네 떡볶이', img: sampleImg, liked: false, desc: '달콤짭짤한 소스가 중독적인 집' },
    { id: 'VI', title: '진아네 떡볶이', img: sampleImg, liked: false, desc: '늦은 시간에도 손님이 많은 인기 맛집' },
    { id: 'VII', title: '진아네 떡볶이', img: sampleImg, liked: false, desc: '넉넉한 양과 합리적인 가격' },
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
                  onClick={(e) => {
                    e.stopPropagation()
                    const globalIndex = page * pageSize + idx
                    setCards(prev => prev.map((card, i) => i === globalIndex ? { ...card, liked: !card.liked } : card))
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

      <PrimaryButton fixedBottom onClick={prev} zIndex={1200}>타로 종료하기</PrimaryButton>

      {detailIndex !== null && cards[detailIndex] && !cards[detailIndex].isRetry && (
        <DetailOverlay onClick={closeDetail}>
          <DetailCard onClick={(e) => e.stopPropagation()} bg={detailCardBg}>
            <DetailInner>
              <DetailImage src={cards[detailIndex].img} alt={cards[detailIndex].title} />
              <DetailTitle>{cards[detailIndex].title}</DetailTitle>
              <DetailDesc>{cards[detailIndex].desc}</DetailDesc>
              <DetailFooter>
                <SmallButton onClick={() => { /* 위치 확인 연결 자리 */ }}>지역위키 확인하기</SmallButton>
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


