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
  SwipeInstruction
} from '../styles/SpreadStep.style'
import tarocardBg from '../../../assets/icons/taro/tarocard_bg.svg'
import tarocard from '../../../assets/icons/taro/tarocard.svg'

function SpreadStep({ next, prev }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [selectedCards, setSelectedCards] = useState([])
  const cardSpreadRef = useRef(null)

  const totalCards = 25
  const cardsPerView = 25

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
    return distanceFromCenter * 5
  }

  return (
    <Wrapper>
      <Background />
      <Overlay />
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
                marginLeft={index === currentIndex ? 0 : -25}
                zIndex={cardsPerView - Math.abs(distanceFromCenter)}
                opacity={isSelected ? 0.4 : 1}
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


