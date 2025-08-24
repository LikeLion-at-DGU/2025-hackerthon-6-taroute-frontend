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
import useTextAnimation from '../../../hooks/useTextAnimation'

function ConfirmStep({ next, prev }) {
  const lines = [
    "질문에 답해줘서 고마워!",
    "너의 답변을 바탕으로 카드를 만들어볼게",
    "잠시만 기다려줘"
  ]
  
  const { displayText, isAnimating, showComplete, handleTextClick, alwaysShowArrow } = useTextAnimation(lines, next)

  return (
    <Wrapper>
      <Overlay />
      <BackButton onClick={prev} />
      <TaruMascot src={taruSvg} alt="타루" aria-label="타루" role="img" />

      <BubbleHeader>
        <span className="name">타루</span>
        <span className="role">타로마스터</span>
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


