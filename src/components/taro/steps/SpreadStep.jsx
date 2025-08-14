import { useState, useRef, useEffect } from 'react'
import {
  Wrapper,
  Background,
  Overlay,
  ContentContainer,
  CardPlaceholder,
  SelectedCardsOverlay,
  SelectedCard,
  InstructionText,
  CardSpread,
  TarotCard,
  NavigationHint,
  ArrowContainer,
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

  // 25장의 카드
  const totalCards = 25
  const cardsPerView = 25 // 모든 카드를 한 번에 보이도록

  // 터치/마우스 이벤트 핸들러
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
    
    // 스와이프 방향과 거리에 따라 카드 이동
    if (Math.abs(translateX) > 30) { // 더 민감하게
      if (translateX > 0) {
        // 오른쪽으로 스와이프 - 이전 카드들
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1)
        }
      } else {
        // 왼쪽으로 스와이프 - 다음 카드들
        if (currentIndex < totalCards - cardsPerView) {
          setCurrentIndex(prev => prev + 1)
        }
      }
    }
    setTranslateX(0)
  }

  // 카드 선택 처리
  const handleCardSelect = (cardIndex) => {
    if (selectedCards.length < 7 && !selectedCards.includes(cardIndex)) {
      setSelectedCards(prev => [...prev, cardIndex])
    }
  }

  // 화살표 클릭으로 카드 이동
  const handleArrowClick = (direction) => {
    if (direction === 'left' && currentIndex > 0) {
      // 왼쪽 화살표 - 이전 카드들
      setCurrentIndex(prev => prev - 1)
    } else if (direction === 'right' && currentIndex < totalCards - cardsPerView) {
      // 오른쪽 화살표 - 다음 카드들
      setCurrentIndex(prev => prev + 1)
    }
  }

  // 마우스 이벤트도 지원
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

  // 디버깅을 위한 로그 추가
  console.log('Current Index:', currentIndex, 'Total Cards:', totalCards, 'Cards Per View:', cardsPerView)

  return (
    <Wrapper>
      <Background />
      <Overlay />
      <ContentContainer>
        {/* 상단 카드 플레이스홀더 - tarocard_bg */}
        <CardPlaceholder>
          <img 
            src={tarocardBg} 
            alt="카드 배경" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '15px'
            }} 
          />
          
          {/* 선택된 카드들이 tarocard_bg의 왼쪽에서 오른쪽으로 딱 맞게 배치 */}
          <SelectedCardsOverlay>
            {selectedCards.map((cardIndex, index) => {
              // tarocard_bg 크기에 맞춰서 카드 배치
              const cardWidth = 122
              const cardHeight = 177
              const placeholderWidth = 343
              const placeholderHeight = 177
              
              // 7장의 카드가 왼쪽에서 오른쪽으로 딱 맞게 배치되도록 계산
              const totalCards = 7
              const availableWidth = placeholderWidth - cardWidth // 사용 가능한 너비
              const spacing = availableWidth / (totalCards - 1) // 카드 간격
              
              // 왼쪽에서 오른쪽으로 균등하게 배치
              const left = index * spacing
              const top = (placeholderHeight - cardHeight) / 2
              
              return (
                <SelectedCard 
                  key={cardIndex} 
                  style={{
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${left}px`,
                    zIndex: index + 1,
                    transform: 'rotate(0deg)',
                    opacity: 0.9 // 약간 투명하게 해서 tarocard_bg가 살짝 보이도록
                  }}
                >
                  <img 
                    src={tarocard} 
                    alt={`선택된 카드 ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SelectedCard>
              )
            })}
          </SelectedCardsOverlay>
        </CardPlaceholder>

        {/* 안내 텍스트 */}
        <InstructionText>
          {selectedCards.length === 7 ? '카드 선택 완료!' : `${selectedCards.length}/7장 선택됨`}
        </InstructionText>

        {/* 하단 카드 스프레드 - 25장 부채꼴 모양 */}
        <CardSpread 
          ref={cardSpreadRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {Array.from({ length: totalCards }, (_, index) => {
            // 부채꼴 모양을 위한 각도 계산 - 중복 방지
            const adjustedIndex = index - currentIndex
            const centerIndex = Math.floor(cardsPerView / 2)
            const distanceFromCenter = adjustedIndex - centerIndex
            const rotation = distanceFromCenter * 3 // 부채꼴 각도 조정
            
            const isVisible = index >= currentIndex && index < currentIndex + cardsPerView
            const isSelected = selectedCards.includes(index)
            
            // 보이지 않는 카드는 렌더링하지 않음
            if (!isVisible) return null
            
            return (
              <TarotCard
                key={`card-${index}`} // 고유한 key 값
                src={tarocard}
                alt={`타로 카드 ${index + 1}`}
                rotation={rotation}
                onClick={() => handleCardSelect(index)}
                style={{ 
                  marginLeft: index === currentIndex ? 0 : '-18px', // 카드 간격 조정으로 덜 겹치도록
                  zIndex: cardsPerView - Math.abs(distanceFromCenter), // 중앙 카드가 위에 오도록
                  opacity: isSelected ? 0.6 : 1,
                  transform: `rotate(${rotation}deg)`,
                  cursor: isSelected ? 'not-allowed' : 'pointer',
                  border: 'none', // 선택된 카드의 테두리 제거
                  filter: isSelected ? 'brightness(0.7)' : 'none'
                }}
              />
            )
          })}
        </CardSpread>

        {/* 하단 네비게이션 힌트 */}
        <NavigationHint>
          <ArrowContainer>
            <span 
              onClick={() => handleArrowClick('left')}
              style={{ 
                cursor: currentIndex > 0 ? 'pointer' : 'not-allowed',
                opacity: currentIndex > 0 ? 1 : 0.5,
                userSelect: 'none'
              }}
            >
              ←
            </span>
            <span 
              onClick={() => handleArrowClick('right')}
              style={{ 
                cursor: currentIndex < totalCards - cardsPerView ? 'pointer' : 'not-allowed',
                opacity: currentIndex < totalCards - cardsPerView ? 1 : 0.5,
                userSelect: 'none'
              }}
            >
              →
            </span>
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


