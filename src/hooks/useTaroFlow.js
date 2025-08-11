import { useCallback, useMemo, useState } from 'react'

export default function useTaroFlow({ totalSteps }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const goNext = useCallback(() => {
    setCurrentStepIndex((idx) => Math.min(idx + 1, totalSteps - 1))
  }, [totalSteps])

  const goPrev = useCallback(() => {
    setCurrentStepIndex((idx) => Math.max(idx - 1, 0))
  }, [])

  const goTo = useCallback((index) => {
    setCurrentStepIndex(() => {
      const clamped = Math.max(0, Math.min(index, totalSteps - 1))
      return clamped
    })
  }, [totalSteps])

  const total = useMemo(() => totalSteps, [totalSteps])

  return { currentStepIndex, goNext, goPrev, goTo, totalSteps: total }
}


