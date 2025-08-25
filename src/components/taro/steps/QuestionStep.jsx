
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
  BackButton,
} from '../styles/QuestionStep.style.js'
import taruSvg from '../../../assets/icons/taru.svg'
import { fetchSlotQuestions } from '../../../apis/taroApi'
import shuffleTaru from '../../../assets/icons/ShuffleTaru.svg'
import { useTranslation } from "react-i18next";


function QuestionStep({ next, prev, goTo }) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentLocationLabel, setCurrentLocationLabel] = useState('현재 위치')
  const [generating, setGenerating] = useState(false)
  const [pendingResume, setPendingResume] = useState(false)
  const [overlayMinDone, setOverlayMinDone] = useState(false)
  const [pendingNextAfterFirst, setPendingNextAfterFirst] = useState(false)

  const defaultFirstQuestion = {
    question: `${t("taro.location")} ‘${currentLocationLabel}’${t("taro.location2")}`,
    options: [t("taro.yes"), t("taro.no")],
  }

  const getFallbackQuestions = () => ([
    { question: "네가 꿈꾸는 이상적인 장소의 반경은 어느 정도일까?", options: ["1시간 내외의 짧은 여행지","2시간 정도는 나갈 수 있는 곳","몇 시간을 달려야 할 먼 거리","집 앞에서 바로 갈 수 있는 근처"] },
    { question: "그곳에서의 하루는 어떤 느낌일까?", options: ["조용하고 아늑한 휴식","활기찬 에너지로 가득한","자연과 함께하는 한가로운","창의력과 영감이 넘치는"] },
    { question: "예산 계획은 어떻게 할 생각이야?", options: ["가벼운 지출로 여유롭게","적당한 비용으로 맛보는","가끔은 특별하게 투자하는","소중한 경험을 위해 아낌없이"] },
    { question: "어떤 분위기의 공간에서 더 편안함을 느껴?", options: ["역동적인 활동이 넘치는 곳","조용하고 평화로운 정원","트렌디한 카페와 바","아늑한 독서 공간"] },
    { question: "너의 시간을 어떻게 사용할 생각이야?", options: ["느긋하게 즐기는 여유","주어진 시간 속 집중","짧은 시간에 많은 활동","오늘 하루의 소중함을 savor"] },
  ])

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
        if (!Array.isArray(qs) || qs.length === 0) {
          setQuestions(getFallbackQuestions())
        } else {
          setQuestions(qs)
        }
      } catch (e) {
        // 실패 시 기본 질문 세트로 폴백
        setQuestions(getFallbackQuestions())
      }
    })()
    return () => { mounted = false }
  }, [])

  // 위치 설정 후 돌아온 경우: 오버레이 1.2초 + 질문 준비되면 2번째 질문로 이동
  useEffect(() => {
    const shouldResume = sessionStorage.getItem('taro_resume_after_location')
    if (shouldResume) {
      sessionStorage.removeItem('taro_resume_after_location')
      setGenerating(true)
      setPendingResume(true)
      setOverlayMinDone(false)
      const t = setTimeout(() => setOverlayMinDone(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const ready = Array.isArray(questions) && questions.length > 0
    if ((pendingResume || pendingNextAfterFirst) && overlayMinDone && ready) {
      setQIdx(1)
      setGenerating(false)
      setPendingResume(false)
      setPendingNextAfterFirst(false)
      setOverlayMinDone(false)
    }
  }, [pendingResume, pendingNextAfterFirst, overlayMinDone, questions])

  // 안전 장치: 복귀 후 3초 내 질문이 준비되지 않으면 폴백을 세팅해 진행
  useEffect(() => {
    if (!pendingResume) return
    const rescue = setTimeout(() => {
      const ready = Array.isArray(questions) && questions.length > 0
      if (!ready) {
        setQuestions(getFallbackQuestions())
        setOverlayMinDone(true)
      }
    }, 3000)
    return () => clearTimeout(rescue)
  }, [pendingResume, questions])

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

    // 세션에 누적 저장 (card_select input_text 용)
    try {
      const prevSaved = JSON.parse(sessionStorage.getItem('taro_answers') || '[]')
      const nextSaved = [...prevSaved]
      nextSaved[qIdx] = label
      sessionStorage.setItem('taro_answers', JSON.stringify(nextSaved))
    } catch {}

    // 첫 번째(디폴트) 질문 분기 처리
    if (qIdx === 0) {
      if (label === t("taro.no")) {
        // LocationStep으로 이동. 돌아오면 오버레이 최소시간 + 질문 준비 확인 후 2번째 질문부터 재개
        sessionStorage.setItem('taro_resume_after_location', '1')
        setGenerating(true)
        setPendingResume(true)
        setOverlayMinDone(false)
        setTimeout(() => setOverlayMinDone(true), 1200)
        goTo && goTo(3)
        return
      }
      // '맞아'면 오버레이 1.2초는 최소 보장하고, 질문이 준비되면 2번째 질문로 이동
      setGenerating(true)
      setPendingNextAfterFirst(true)
      setOverlayMinDone(false)
      setTimeout(() => setOverlayMinDone(true), 1200)
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
      <BackButton onClick={prev} />
      {generating && (
        <GeneratingOverlay>
          <GeneratingInner>
            <img src={shuffleTaru} alt="로딩" />
            <p>질문 생성 중</p>
          </GeneratingInner>
        </GeneratingOverlay>
      )}
      <TaruMascot src={taruSvg} alt="타루" aria-label="타루" role="img" />



      <QuestionBox>
        <QuestionTitle>{qIdx + 1}{t("taro.que")}</QuestionTitle>
        <QuestionText>{qIdx === 0 ? defaultFirstQuestion.question : (questions[qIdx - 1]?.question || t("taro.queloading"))}</QuestionText>
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

// 오버레이 로딩 (아니요 동작과 동일 디자인)
const GeneratingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
`

const GeneratingInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  img { width: 120px; height: auto; }
  p {
    margin: 0;
    color: #fff;
    font-family: MaruBuriOTF;
    font-size: 18px;
  }
`