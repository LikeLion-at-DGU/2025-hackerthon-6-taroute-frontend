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
    Button
} from '../styles/ReadyStep.style'
import taruIcon from '../../../assets/icons/ResultTaru.svg'
import { useTranslation } from "react-i18next";

function GoStep({ next }) {
    const navigate = useNavigate()
    
    // 최소 1초는 보여주고 TaroResult 페이지로 이동
    const { t } = useTranslation();


    useEffect(() => {
        const t = setTimeout(() => {
            navigate('/taro/result')
        }, 500)
        return () => clearTimeout(t)
    }, [navigate])

    return (
        <Wrapper>
            <Background />
            <Overlay />
            <ContentContainer>
                <TaruIcon src={taruIcon} alt="타루 캐릭터" />
                <Title>{t("taro.check")}</Title>
            </ContentContainer>
        </Wrapper>
    )
}

export default GoStep;



