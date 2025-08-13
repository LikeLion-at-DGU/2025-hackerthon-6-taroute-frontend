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
import taruIcon from '../../../assets/icons/taru2.svg'

function ReadyStep({ next, prev }) {
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


