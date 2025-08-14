import { useState, useEffect } from 'react'

export default function useTextAnimation(lines, next) {
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [showComplete, setShowComplete] = useState(false)

    const handleTextClick = () => {
        if (!isAnimating) {
            setIsAnimating(true)
            setCurrentLineIndex(0)
            setShowComplete(false)
        } else if (currentLineIndex < lines.length - 1) {
            setCurrentLineIndex(prev => prev + 1)
        } else {
            // 마지막 문장까지 모두 표시된 상태
            setShowComplete(true)
        }
    }

    // 모든 문장이 표시되고 완료 상태가 되면 다음 단계로 이동
    useEffect(() => {
        console.log('useEffect triggered:', { isAnimating, currentLineIndex, linesLength: lines.length, showComplete, hasNext: !!next })

        if (showComplete && currentLineIndex === lines.length - 1) {
            console.log('All text displayed and completed, moving to next step...')
            // 0.5초 후에 다음 단계로 이동 (사용자가 마지막 문장을 읽을 수 있도록)
            const timer = setTimeout(() => {
                if (next && typeof next === 'function') {
                    next()
                } else {
                    console.error('next function is not available:', next)
                }
            }, 500)

            return () => clearTimeout(timer)
        }
    }, [showComplete, currentLineIndex, lines.length, next])

    const displayText = lines.slice(0, currentLineIndex + 1).join('<br />')

    return {
        displayText,
        isAnimating,
        showComplete,
        handleTextClick
    }
}
