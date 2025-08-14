import { useState } from 'react'
import {
  Wrapper,
  Overlay,
  TaruMascot,
  BubbleHeader,
  BubbleContent,
  ButtonPrev,
  ButtonNext,
} from '../styles/ConsentStep.style.js'
import taruSvg from '../../../assets/icons/taru.svg'
import useTextAnimation from '../../../hooks/useTextAnimation'

function ConsentStep({ next, prev }) {
  console.log('ConsentStep rendered with next:', next, 'prev:', prev)

  const lines = [
    "안녕! 난 타로마스터 '타루'라고 해",
    "본격적인 상담에 앞서 네가 어떤 고민을 가지고 있는지",
    "들어보고 너의 상황에 맞는 추천을 해줄게",
    "너에게 더 적합한 답변을 선택해줘"
  ]

  const { displayText, isAnimating, showComplete, handleTextClick, alwaysShowArrow } = useTextAnimation(lines, next)

  return (
    <Wrapper>
      <Overlay />
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
          <div className="next-indicator">&gt;&gt;</div>
        )}
      </BubbleContent>
    </Wrapper>
  )
}

export default ConsentStep
