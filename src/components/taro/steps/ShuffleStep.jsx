import { useEffect } from 'react'
import {
  Wrapper,
  Background,
  Overlay,
  ContentContainer,
  TaruIcon,
  Title
} from '../styles/ShuffleStep.style'
import taruIcon from '../../../assets/icons/ShuffleTaru.svg'

function ShuffleStep({ next, prev }) {
  useEffect(() => {
    // 셔플 애니메이션이 끝나면 자동으로 다음 단계로 이동
    const timer = setTimeout(() => {
      next()
    }, 3000) // 3초 후 자동 이동

    return () => clearTimeout(timer)
  }, [next])

  return (
    <Wrapper>
      <Background />
      <Overlay />
      <ContentContainer>
        <TaruIcon src={taruIcon} alt="타루 캐릭터" />
        <Title>카드 셔플 중</Title>
      </ContentContainer>
    </Wrapper>
  )
}

export default ShuffleStep


