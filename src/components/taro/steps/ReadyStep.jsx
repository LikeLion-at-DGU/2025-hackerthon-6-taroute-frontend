import { useEffect } from 'react'
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
import { useTranslation } from "react-i18next";


function ReadyStep({ next, prev }) {
  // 해석중에서 2초 후 결과확인하기(GoStep)로 이동하는 타이머
  const { t } = useTranslation();

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
        <Title>{t("taro.loading2")}</Title>
      </ContentContainer>
    </Wrapper>
  )
}

export default ReadyStep


