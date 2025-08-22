import styled from 'styled-components'
import bgImage from '../../../assets/images/bg_3.jpg'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 812px;
  min-height: 812px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  overflow: hidden;
  padding: 50px 20px;
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  z-index: 10;
  position: relative;
  width: 100%;
`;

export const CardPlaceholder = styled.div`
  width: 343px;
  height: 177px;
  margin-bottom: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const CardBackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
`;

export const SelectedCardsOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

export const SelectedCard = styled.div`
  width: 122px;
  height: 177px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  position: absolute;
  z-index: ${props => props.zIndex || 1};
  top: ${props => props.top || '0'}px;
  left: ${props => props.left || '0'}px;
  opacity: 0.9;
  transform: rotate(0deg);
`;

export const SelectedCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InstructionText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: MaruBuriOTF;
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

export const CardSpread = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;
  max-width: 1200px;
  overflow: visible;
  position: relative;
  min-height: 200px;
  transform: ${props => `translateX(${props.translateX}px)`};
  transition: ${props => props.isDragging ? 'none' : 'transform 0.3s ease-out'};
`;

export const TarotCard = styled.img`
  width: 126px;
  height: 177px;
  transition: transform 0.2s ease; /* 선택 시 색변경은 즉시 반영되도록 filter/opacity는 전환하지 않음 */
  cursor: pointer;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  margin-left: ${props => props.marginLeft || '0'}px;
  z-index: ${props => props.zIndex || 1};
  opacity: ${props => props.opacity || 1};
  transform: ${props => `rotate(${props.rotation}deg)`};
  border: none;
  filter: ${props => props.isSelected ? 'brightness(0.5)' : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'};
  /* 선택 후에도 다시 눌러 해제할 수 있도록 항상 클릭 가능 */
  pointer-events: auto;
  transform-origin: center bottom;
  user-select: none;
  will-change: transform;
  
  &:hover {
    /* 선택 상태에서도 어두운 상태를 유지하도록 hover 필터를 분기 */
    transform: ${props => `rotate(${props.rotation}deg)`};
    filter: ${props => props.isSelected ? 'brightness(0.5)' : 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5))'};
  }
`;

export const NavigationHint = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const ArrowContainer = styled.div`
  display: flex;
  gap: 20px;
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 10px;
`;

export const ArrowButton = styled.span`
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  user-select: none;
  
  &:hover {
    opacity: ${props => props.disabled ? 0.5 : 0.8};
  }
`;

export const SwipeInstruction = styled.p`
  font-size: 1rem;
  font-family: MaruBuriOTF;
  color: #ffffff;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
`;
