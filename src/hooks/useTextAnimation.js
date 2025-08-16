import { useEffect, useState } from 'react'

export default function useTextAnimation(lines, next) {
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [showComplete, setShowComplete] = useState(false)

    const handleTextClick = () => {
        if (showComplete) return
        if (currentLineIndex < lines.length - 1) {
            setCurrentLineIndex(prev => prev + 1)
        } else {
            setShowComplete(true)
        }
    }

    useEffect(() => {
        if (showComplete && currentLineIndex === lines.length - 1) {
            const timer = setTimeout(() => {
                if (typeof next === 'function') next()
            }, 400)
            return () => clearTimeout(timer)
        }
    }, [showComplete, currentLineIndex, lines.length, next])

    const displayText = lines.slice(0, currentLineIndex + 1).join('<br />')

    return {
        displayText,
        isAnimating: true,
        showComplete,
        handleTextClick,
        alwaysShowArrow: true, // 질문화살표 보이게
    }
}
