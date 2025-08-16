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
} from '../styles/ResultStep.style.js'
import PrimaryButton from '../../common/PrimaryButton.jsx'
import sampleImg from '../../../assets/images/ads_temp/temp1.jpg'
import cardBg from '../../../assets/icons/taro/ResultTaroCard.svg'
import { useState, useMemo } from 'react'
import heartIcon from '../../../assets/icons/Heart.svg'
import blackHeartIcon from '../../../assets/icons/BlackHeart.svg'

function ResultStep({ prev }) {
  const [cards, setCards] = useState(() => ([
    { id: 'I', title: '진아네 떡볶이', img: sampleImg, liked: true },
    { id: 'II', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'III', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'IV', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'V', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'VI', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'VII', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'VIII', title: '진아네 떡볶이', img: sampleImg, liked: false },
  ]))

  const [page, setPage] = useState(0)
  const pageSize = 4
  const maxPage = Math.ceil(cards.length / pageSize) - 1
  const pageCards = useMemo(() => {
    const start = page * pageSize
    return cards.slice(start, start + pageSize)
  }, [page, cards])

  return (
    <Wrapper>
      <Overlay />
      <Content>
        <Title>운명의 카드</Title>

        <Grid>
          {pageCards.map((c, idx) => (
            <Card key={c.id} bg={cardBg}>
              <CardBadge>{c.id}</CardBadge>
              <CardImage src={c.img} alt={c.title} />
              <CardFooter>
                <FooterLabel>{c.title}</FooterLabel>
                <HeartButton
                  onClick={() => {
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
    </Wrapper>
  )
}

export default ResultStep


