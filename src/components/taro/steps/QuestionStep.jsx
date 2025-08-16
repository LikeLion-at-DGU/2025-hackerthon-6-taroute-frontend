
import styled from 'styled-components'
import { useState } from 'react'
import {
  Wrapper,
  Overlay,
  TaruMascot,
  BubbleHeader,
  BubbleContent,
} from '../styles/ConsentStep.style.js'
import taruSvg from '../../../assets/icons/taru.svg'

const QuestionBox = styled.div`
  position: absolute;
  top: 320px;
  left: 16px;
  right: 16px;
  background: rgba(55, 35, 80, 0.95);
  color: #fff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.35);
`

const QuestionTitle = styled.div`
  font-family: MaruBuriOTF;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  opacity: 0.9;
`

const QuestionText = styled.div`
  font-family: MaruBuriOTF;
  font-size: 16px;
  line-height: 1.7;
`

const Options = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  top: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 18px;
  border-radius: 12px;
  border: none;
  background: #F0F0F0;
  color: #2A2A2A;
  font-family: MaruBuriOTF;
  font-size: 18px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  transition: transform .12s ease, background .12s ease;

  &:active { transform: scale(0.98); }
`

function QuestionStep({ next, prev }) {
  const questions = [
    "현재 방문하고 싶은 지역이 ‘충무로3가’가 맞아?",
    "오늘은 실내 활동이 좋아?",
    "카페보다 식당이 더 끌려?",
    "조용한 곳이 좋아, 활기찬 곳이 좋아?",
    "대중교통 접근성이 중요해?",
    "예산은 부담되지 않는 편이야?",
  ]

  const [qIdx, setQIdx] = useState(0)

  const options = [
    { key: 1, label: '맞아' },
    { key: 2, label: '아니야' },
  ]

  const handleSelect = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(prev => prev + 1)
    } else {
      next()
    }
  }

  return (
    <Wrapper>
      <Overlay />
      <TaruMascot src={taruSvg} alt="타루" aria-label="타루" role="img" />

      <QuestionBox>
        <QuestionTitle>{qIdx + 1}번째 질문</QuestionTitle>
        <QuestionText>{questions[qIdx]}</QuestionText>
      </QuestionBox>

      <Options>
        {options.map((opt) => (
          <OptionButton key={opt.key} onClick={handleSelect}>
            <span style={{opacity: 0.8}}>{opt.key}</span>
            <span>{opt.label}</span>
          </OptionButton>
        ))}
      </Options>

    </Wrapper>
  )
}

export default QuestionStep


