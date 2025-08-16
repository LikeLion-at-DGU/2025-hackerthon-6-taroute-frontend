import {
  Wrapper,
  Overlay,
  Title,
  Grid,
  Card,
  CardBadge,
  CardImage,
  CardFooter,
  Heart,
  ChevronRight,
  Instruction,
  EndButton,
} from '../styles/ResultStep.style.js'
import sampleImg from '../../../assets/images/ads_temp/temp1.jpg'

function ResultStep({ prev }) {
  const cards = [
    { id: 'I', title: '진아네 떡볶이', img: sampleImg, liked: true },
    { id: 'II', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'III', title: '진아네 떡볶이', img: sampleImg, liked: false },
    { id: 'IV', title: '진아네 떡볶이', img: sampleImg, liked: false },
  ]

  return (
    <Wrapper>
      <Overlay />

      <Title>운명의 카드</Title>

      <Grid>
        {cards.map((c) => (
          <Card key={c.id}>
            <CardBadge>{c.id}</CardBadge>
            <CardImage src={c.img} alt={c.title} />
            <CardFooter>
              <span>{c.title}</span>
              <Heart>{c.liked ? '❤' : '♡'}</Heart>
            </CardFooter>
          </Card>
        ))}
        <ChevronRight>{'›'}</ChevronRight>
      </Grid>

      <Instruction>카드를 눌러 자세히 확인해보세요</Instruction>

      <EndButton onClick={prev}>타로 종료하기</EndButton>
    </Wrapper>
  )
}

export default ResultStep


