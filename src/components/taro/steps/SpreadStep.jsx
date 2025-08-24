import { useState, useRef, useEffect } from 'react'
import {
  Wrapper,
  Background,
  Overlay,
  ContentContainer,
  CardPlaceholder,
  CardBackgroundImage,
  SelectedCardsOverlay,
  SelectedCard,
  SelectedCardImage,
  InstructionText,
  CardSpread,
  TarotCard,
  NavigationHint,
  ArrowContainer,
  ArrowButton,
  SwipeInstruction,
  BackButton
} from '../styles/SpreadStep.style'
import tarocardBg from '../../../assets/icons/taro/tarocard_bg.svg'
import tarocard from '../../../assets/icons/taro/tarocard.svg'
import { postCardSelect } from '../../../apis/taroApi'

function SpreadStep({ next, prev }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [selectedCards, setSelectedCards] = useState([])
  const cardSpreadRef = useRef(null)
  const hasRequestedRef = useRef(false)

  const totalCards = 25
  const cardsPerView = 25 //카드 퍼짐 넓이 조절

  const handleTouchStart = (e) => {
    setIsDragging(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const diff = clientX - startX
    setTranslateX(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (Math.abs(translateX) > 50) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1)
      } else if (translateX < 0 && currentIndex < totalCards - cardsPerView) {
        setCurrentIndex(prev => prev + 1)
      }
    }
  }

  const handleCardSelect = (cardIndex) => {
    if (selectedCards.includes(cardIndex)) {
      setSelectedCards(prev => prev.filter(index => index !== cardIndex))
    } else if (selectedCards.length < 7) {
      setSelectedCards(prev => [...prev, cardIndex])
    }
  }

  const handleArrowClick = (direction) => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setTranslateX(0)
    } else if (direction === 'right' && currentIndex < totalCards - cardsPerView) {
      setCurrentIndex(prev => prev + 1)
      setTranslateX(0)
    }
  }

  useEffect(() => {
    const element = cardSpreadRef.current
    if (!element) return

    element.addEventListener('mousedown', handleTouchStart)
    element.addEventListener('mousemove', handleTouchMove)
    element.addEventListener('mouseup', handleTouchEnd)
    element.addEventListener('mouseleave', handleTouchEnd)

    return () => {
      element.removeEventListener('mousedown', handleTouchStart)
      element.removeEventListener('mousemove', handleTouchMove)
      element.removeEventListener('mouseup', handleTouchEnd)
      element.removeEventListener('mouseleave', handleTouchEnd)
    }
  }, [isDragging, startX, translateX, currentIndex])

  // 7장이 모두 선택되면 즉시 ReadyStep으로 이동하고,
  // 백그라운드에서 카드 선택 결과를 요청해 세션에 저장
  useEffect(() => {
    if (selectedCards.length === 7) {
      // 먼저 다음 단계로 넘어가 로딩 화면(ReadyStep)을 보여준다
      next()

      // 결과는 백그라운드로 요청하여 세션에 저장
      ;(async () => {
        if (hasRequestedRef.current) return
        hasRequestedRef.current = true
        try {
          // 서버는 카드 인덱스 대신 위치/텍스트를 사용하므로 바로 호출
          const result = await postCardSelect()
          const payload = Array.isArray(result) ? { select: result } : result
          sessionStorage.setItem('taro_selected_result', JSON.stringify(payload))
        } catch (e) {
          sessionStorage.setItem('taro_selected_result', JSON.stringify({ select: [] }))
        }
      })()
    }
  }, [selectedCards, next])

  const calculateSelectedCardPosition = (index) => {
    const cardWidth = 122
    const placeholderWidth = 343
    const availableWidth = placeholderWidth - cardWidth
    const spacing = availableWidth / 6
    const left = index * spacing
    const top = (177 - 177) / 2
    
    return { left, top, zIndex: index + 1 }
  }

  const calculateCardRotation = (index) => {
    const adjustedIndex = index - currentIndex
    const centerIndex = Math.floor(cardsPerView / 2)
    const distanceFromCenter = adjustedIndex - centerIndex
    return distanceFromCenter * 3 //카드 회전 각도 조절
  }

  return (
    <Wrapper>
      <Background />
      <Overlay />
      <BackButton onClick={prev} />
      <ContentContainer>
        <CardPlaceholder>
          <CardBackgroundImage src={tarocardBg} alt="카드 배경" />
          
          <SelectedCardsOverlay>
            {selectedCards.map((cardIndex, index) => {
              const position = calculateSelectedCardPosition(index)
              return (
                <SelectedCard 
                  key={cardIndex} 
                  top={position.top}
                  left={position.left}
                  zIndex={position.zIndex}
                >
                  <SelectedCardImage 
                    src={tarocard} 
                    alt={`선택된 카드 ${index + 1}`}
                  />
                </SelectedCard>
              )
            })}
          </SelectedCardsOverlay>
        </CardPlaceholder>

        <InstructionText>
          {selectedCards.length === 7 ? '카드 선택 완료!' : '7장을 뽑아주세요'}
        </InstructionText>

        <CardSpread 
          ref={cardSpreadRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          translateX={translateX}
          isDragging={isDragging}
        >
          {Array.from({ length: totalCards }, (_, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + cardsPerView
            if (!isVisible) return null
            
            const rotation = calculateCardRotation(index)
            const isSelected = selectedCards.includes(index)
            const centerIndex = Math.floor(cardsPerView / 2)
            const distanceFromCenter = (index - currentIndex) - centerIndex
            
            return (
              <TarotCard
                key={`card-${index}`}
                src={tarocard}
                alt={`타로 카드 ${index + 1}`}
                rotation={rotation}
                marginLeft={index === currentIndex ? 0 : -60}
                zIndex={cardsPerView - Math.abs(distanceFromCenter)}
                opacity={1}
                isSelected={isSelected}
                onClick={() => handleCardSelect(index)}
              />
            )
          })}
        </CardSpread>

        <NavigationHint>
          <ArrowContainer>
            <ArrowButton 
              disabled={currentIndex <= 0}
              onClick={() => handleArrowClick('left')}
            >
              ←
            </ArrowButton>
            <ArrowButton 
              disabled={currentIndex >= totalCards - cardsPerView}
              onClick={() => handleArrowClick('right')}
            >
              →
            </ArrowButton>
          </ArrowContainer>
          <SwipeInstruction>
            좌우로 스와이프해주세요
          </SwipeInstruction>
        </NavigationHint>
      </ContentContainer>
    </Wrapper>
  )
}

export default SpreadStep


