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
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const HomeButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 18px;
    height: 21px;
    filter: brightness(0) invert(1);
  }
`;

function ConfirmStep({ next, prev }) {
  const navigate = useNavigate();
  const lines = [
    "질문에 답해줘서 고마워!",
    "너의 답변을 바탕으로 카드를 만들어볼게",
    "잠시만 기다려줘"
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


