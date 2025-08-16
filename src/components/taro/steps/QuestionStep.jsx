
import styled from 'styled-components'
import { useState } from 'react'
import {
  Wrapper,
  Overlay,
  TaruMascot,
  QuestionBox,
  QuestionTitle,
  QuestionText,
  Options,
  OptionButton,
} from '../styles/QuestionStep.style.js'
import taruSvg from '../../../assets/icons/taru.svg'

function QuestionStep({ next, prev, goTo }) {
  const questions = [
    "현재 방문하고 싶은 지역이 ‘현위치’가 맞아?",
    "오늘은 실내 활동이 좋아?",
    "카페보다 식당이 더 끌려?",
    "조용한 곳이 좋아, 활기찬 곳이 좋아?",
    "대중교통 접근성이 중요해?",
    "예산은 부담되지 않는 편이야?",
  ]

  const [qIdx, setQIdx] = useState(0)

  const getOptionsFor = (index) => {
    if (index === 0) {
      return [
        { key: 1, label: '맞아' },
        { key: 2, label: '아니야' },
      ]
    }
    return [
      { key: 1, label: '매우 그렇다' },
      { key: 2, label: '그런 편이야' },
      { key: 3, label: '아닌 편이야' },
      { key: 4, label: '전혀 아니야' },
    ]
  }

  const handleSelect = (label) => {
    if (qIdx < questions.length - 1) {
      // 1번 질문(인덱스 0)에서 '아니야' 선택 시 LocationStep으로 분기
      if (qIdx === 0 && label === '아니야') {
        // LocationStep이 QuestionStep 바로 다음 인덱스
        goTo && goTo(3) // Intro(0), Consent(1), Question(2), Location(3)
        return
      }
      setQIdx(prev => prev + 1)
    } else {
      // 모든 질문이 끝나면 ShuffleStep(인덱스 5)으로 이동
      if (goTo) {
        goTo(5)
      } else {
        next()
      }
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
        {getOptionsFor(qIdx).map((opt) => (
          <OptionButton key={opt.key} onClick={() => handleSelect(opt.label)}>
            <span style={{opacity: 0.8}}>{opt.key}</span>
            <span>{opt.label}</span>
          </OptionButton>
        ))}
      </Options>

    </Wrapper>
  )
}

export default QuestionStep


