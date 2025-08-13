import {
  Wrapper,
  Background,
  Overlay,
  ContentContainer,
  TaruIcon,
  Title,
  ButtonContainer,
  Button
} from '../styles/ShuffleStep.style'
import taruIcon from '../../../assets/icons/taru.svg'

function ShuffleStep({ next, prev }) {
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


