import { useState } from 'react'
import {
  Wrapper,
  Overlay,
  TaruMascot,
  BubbleHeader,
  BubbleContent,
  ButtonPrev,
  ButtonNext,
  BackButton,
} from '../styles/ConfirmStep.style.js'
import taruSvg from '../../../assets/icons/taru.svg'
import homeIcon from '../../../assets/icons/home.svg'
import useTextAnimation from '../../../hooks/useTextAnimation'

import { useTranslation } from "react-i18next";


function ConfirmStep({ next, prev }) {
  const { t } = useTranslation();
  const lines = [
    t("taro.thank"),
    t("taro.thank2"),
    t("taro.thank3")
  ]
  
  const { displayText, isAnimating, showComplete, handleTextClick, alwaysShowArrow } = useTextAnimation(lines, next)

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Wrapper>
      <Overlay />
      <BackButton onClick={prev} />
      <HomeButton onClick={handleGoHome}>
        <img src={homeIcon} alt="홈" />
      </HomeButton>
      <TaruMascot src={taruSvg} alt="타루" aria-label="타루" role="img" />

      <BubbleHeader>
        <span className="name">{t("taro.name")}</span>
        <span className="role">{t("taro.job")}</span>
      </BubbleHeader>

      <BubbleContent>
        <div 
          className="text" 
          dangerouslySetInnerHTML={{ __html: displayText }}
          onClick={handleTextClick}
          style={{ cursor: 'pointer' }}
        />
        {alwaysShowArrow && (
          <div
            className="next-indicator"
            role="button"
            tabIndex={0}
            style={{ opacity: showComplete ? 1 : 0.4, pointerEvents: showComplete ? 'auto' : 'none' }}
            onClick={() => { if (showComplete) { next(); } }}
            onKeyDown={(e) => { if (showComplete && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); next(); } }}
          >&gt;&gt;</div>
        )}
      </BubbleContent>
    </Wrapper>
  )
}

export default ConfirmStep


