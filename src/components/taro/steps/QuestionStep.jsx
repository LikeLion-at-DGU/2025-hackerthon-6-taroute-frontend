
import styled from 'styled-components'
import { useEffect, useState } from 'react'
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
import { fetchSlotQuestions } from '../../../apis/taroApi'

function QuestionStep({ next, prev, goTo }) {
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentLocationLabel, setCurrentLocationLabel] = useState('현재 위치')

  const defaultFirstQuestion = {
    question: `현재 방문하고 싶은 지역이 ‘${currentLocationLabel}’가 맞아?`,
    options: ["맞아", "아니야"],
  }

  useEffect(() => {
    // 메인에서 설정한 위치명 우선
    try {
      const saved = JSON.parse(localStorage.getItem('selectedLocation') || '{}')
      if (saved?.address) setCurrentLocationLabel(saved.address)
    } catch {}

    // 좌표만 있을 경우 역지오코딩으로 보정
    try {
      const raw = sessionStorage.getItem('user_selected_location')
      if (raw) {
        const pos = JSON.parse(raw)
        const { kakao } = window
        if (kakao?.maps?.services && typeof pos?.lat === 'number' && typeof pos?.lng === 'number') {
          const geocoder = new kakao.maps.services.Geocoder()
          geocoder.coord2RegionCode(pos.lng, pos.lat, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const region = result?.find(r => r.region_type === 'H') || result?.[0]
              const label = region?.region_3depth_name || region?.region_2depth_name
              if (label) setCurrentLocationLabel(label)
            }
          })
        }
      }
    } catch {}

    let mounted = true
    ;(async () => {
      try {
        const qs = await fetchSlotQuestions()
        if (!mounted) return
        setQuestions(qs)
      } catch (e) {
        // 실패 시 기본 질문 세트로 폴백
        const fallback = [
          { question: "네가 꿈꾸는 이상적인 장소의 반경은 어느 정도일까?", options: ["1시간 내외의 짧은 여행지","2시간 정도는 나갈 수 있는 곳","몇 시간을 달려야 할 먼 거리","집 앞에서 바로 갈 수 있는 근처"] },
          { question: "그곳에서의 하루는 어떤 느낌일까?", options: ["조용하고 아늑한 휴식","활기찬 에너지로 가득한","자연과 함께하는 한가로운","창의력과 영감이 넘치는"] },
          { question: "예산 계획은 어떻게 할 생각이야?", options: ["가벼운 지출로 여유롭게","적당한 비용으로 맛보는","가끔은 특별하게 투자하는","소중한 경험을 위해 아낌없이"] },
          { question: "어떤 분위기의 공간에서 더 편안함을 느껴?", options: ["역동적인 활동이 넘치는 곳","조용하고 평화로운 정원","트렌디한 카페와 바","아늑한 독서 공간"] },
          { question: "너의 시간을 어떻게 사용할 생각이야?", options: ["느긋하게 즐기는 여유","주어진 시간 속 집중","짧은 시간에 많은 활동","오늘 하루의 소중함을 savor"] },
        ]
        setQuestions(fallback)
      }
    })()
    return () => { mounted = false }
  }, [])

  // 위치 설정 후 돌아온 경우, 첫 질문은 건너뛰고 두 번째 질문부터 이어서 진행
  useEffect(() => {
    const shouldResume = sessionStorage.getItem('taro_resume_after_location')
    if (shouldResume) {
      sessionStorage.removeItem('taro_resume_after_location')
      setQIdx(1)
    }
  }, [])

  const getOptionsFor = (index) => {
    if (index === 0) return defaultFirstQuestion.options.map((opt, i) => ({ key: i + 1, label: opt }))
    const q = questions[index - 1]
    if (!q || !Array.isArray(q.options)) return []
    return q.options.map((opt, i) => ({ key: i + 1, label: opt }))
  }

  const handleSelect = (label) => {
    setAnswers(prev => {
      const nextAnswers = [...prev]
      nextAnswers[qIdx] = label
      return nextAnswers
    })

    // 첫 번째(디폴트) 질문 분기 처리
    if (qIdx === 0) {
      if (label === '아니야') {
        // LocationStep으로 이동 후 돌아오면 두 번째 질문부터 재개
        sessionStorage.setItem('taro_resume_after_location', '1')
        goTo && goTo(3)
        return
      }
      // '맞아'면 다음 질문으로 진행
      setQIdx(1)
      return
    }

    const totalQuestionCount = 1 + (questions?.length || 0) // 디폴트 1 + 서버 질문 N
    if (qIdx < totalQuestionCount - 1) {
      setQIdx(prev => prev + 1)
      return
    }
    // 모든 질문 종료 -> ShuffleStep으로 이동
    if (goTo) {
      goTo(5)
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
        <QuestionText>{qIdx === 0 ? defaultFirstQuestion.question : (questions[qIdx - 1]?.question || '질문을 불러오는 중...')}</QuestionText>
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


