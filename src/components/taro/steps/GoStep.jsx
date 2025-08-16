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
import taruIcon from '../../../assets/icons/ResultTaru.svg'

function GoStep({ next, prev }) {
    return (
        <Wrapper>
            <Background />
            <Overlay />
            <ContentContainer>
                <TaruIcon src={taruIcon} alt="타루 캐릭터" />
                <Title>결과확인하기</Title>
            </ContentContainer>
        </Wrapper>
    )
}

export default GoStep



