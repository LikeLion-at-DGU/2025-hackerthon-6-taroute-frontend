import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wrapper,
  Background,
  Overlay,
  ContentContainer,
  TaruIcon,
  Title,
  ButtonContainer,
  Button,
} from '../styles/ReadyStep.style'
import taruIcon from '../../../assets/icons/ReadTaru.svg'

function ReadyStep({ next, prev }) {
  const navigate = useNavigate()
  
  // 해석중에서 2초 후 TaroResult 페이지로 이동하는 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/taro/result')
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])
  
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


