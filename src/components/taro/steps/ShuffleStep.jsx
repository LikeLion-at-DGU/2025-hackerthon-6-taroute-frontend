import { useEffect } from 'react'
import {
  Wrapper,
  Background,
  Overlay,
  ContentContainer,
  TaruIcon,
  Title,
  BackButton
} from '../styles/ShuffleStep.style'
import taruIcon from '../../../assets/icons/ShuffleTaru.svg'
import { useTranslation } from "react-i18next";


function ShuffleStep({ next, prev }) {
  const { t } = useTranslation();
  useEffect(() => {
    // 셔플 애니메이션이 끝나면 자동으로 다음 단계로 이동
    const timer = setTimeout(() => {
      next()
    }, 1000) // 2초 후 자동 이동

    return () => clearTimeout(timer)
  }, [next])

  return (
    <Wrapper>
      <Background />
      <Overlay />
      <BackButton onClick={prev} />
      <ContentContainer>
        <TaruIcon src={taruIcon} alt="타루 캐릭터" />
        <Title>{t("taro.loading")}</Title>
      </ContentContainer>
    </Wrapper>
  )
}

export default ShuffleStep


