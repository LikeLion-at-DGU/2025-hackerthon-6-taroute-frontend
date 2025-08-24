import {
  Wrapper,
  Background,
  Overlay,
  Title,
  Description,
  Button,
  BackButton,
} from '../styles/IntroStep.styles.js'

function IntroStep({ next, prev }) {
  return (
    <Wrapper>
      <Background />
      <Overlay />
      <BackButton onClick={prev} />
      <Title>
        타루와 함께하는
        <br />
        나만의 타로
      </Title>

      <Description>
        우리는 살아가며
        <br />
        수많은 식당과 장소, 순간을 만납니다.
        <br />
        하지만 그 모든 경험이 만족스럽지는 않았죠.
        <br />
        <br />
        저희는 잠깐의 만남이라도 당신에게
        <br />
        오래도록 좋은 기억으로 남기를 바랍니다.
        <br />
        <br />
        지금, 당신의 설레는 운명을 마주해보세요.
      </Description>

      <Button type="button" onClick={next}>타로 확인하기</Button>
    </Wrapper>
  )
}

export default IntroStep


