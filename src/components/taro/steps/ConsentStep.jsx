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
} from '../styles/ConsentStep.style.js'
import taruSvg from '../../../assets/icons/taru.svg'
import useTextAnimation from '../../../hooks/useTextAnimation'
import { useTranslation } from "react-i18next";


function ConsentStep({ next, prev }) {
  const { t } = useTranslation();
  console.log('ConsentStep rendered with next:', next, 'prev:', prev)

  const lines = [
    t("taro.detail"),
    t("taro.detail2"),
    t("taro.detail3"),
    t("taro.detail4")
  ]

  const { displayText, isAnimating, showComplete, handleTextClick, alwaysShowArrow } = useTextAnimation(lines, next)

  return (
    <Wrapper>
      <Overlay />
      <BackButton onClick={prev} />
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

export default ConsentStep
