import { useEffect } from 'react'
import {
  Wrapper,
  Background,
  Overlay,
  ContentContainer,
  TaruIcon,
  Title,
  ButtonContainer,
  Button
} from '../styles/ReadyStep.style'
import taruIcon from '../../../assets/icons/ReadTaru.svg'

function ReadyStep({ next, prev }) {
  // 해석중에서 2초 후 결과확인하기(GoStep)로 이동하는 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof next === 'function') next()
    }, 2000)
    return () => clearTimeout(timer)
  }, [next])
  return (
    <Wrapper>
      <Background />
      <Overlay />
      <ContentContainer>
        <TaruIcon src={taruIcon} alt="타루 캐릭터" />
        <Title>카드 해석 중</Title>
      </ContentContainer>
    </Wrapper>
  )
}

export default ReadyStep


