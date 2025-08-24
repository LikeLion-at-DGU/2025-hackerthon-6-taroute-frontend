import {
  Wrapper,
  Background,
  Overlay,
  Title,
  Description,
  Button,
  BackButton,
} from '../styles/IntroStep.styles.js'
import { useTranslation } from "react-i18next";


function IntroStep({ next, prev }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Background />
      <Overlay />
      <BackButton onClick={prev} />
      <Title>
        {t("taro.title")}
        <br />
        {t("taro.title2")}
      </Title>

      <Description>
        {t("taro.subtitle")}
        <br />
        {t("taro.subtitle2")}
        <br />
        {t("taro.subtitle3")}
        <br />
        <br />
        {t("taro.subtitle4")}
        <br />
        {t("taro.subtitle5")}
        <br />
        <br />
        {t("taro.subtitle6")}
      </Description>

      <Button type="button" onClick={next}>{t("taro.gotaro")}</Button>
    </Wrapper>
  )
}

export default IntroStep


