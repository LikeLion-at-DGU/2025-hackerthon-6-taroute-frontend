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

function GoStep({ next }) {
    // 최소 1초는 보여주고 다음 단계로 이동
    useEffect(() => {
        const t = setTimeout(() => {
            if (typeof next === 'function') next()
        }, 1000)
        return () => clearTimeout(t)
    }, [next])

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



