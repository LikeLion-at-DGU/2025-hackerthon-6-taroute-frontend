import styled from 'styled-components'
import bgImage from '../../../assets/images/bg_3.jpg'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  overflow: hidden;
  padding: 40px 20px;
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
  margin-bottom: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
`;

export const InstructionText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
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
  max-width: 1200px; /* 카드들이 더 여유롭게 펼쳐질 수 있도록 너비 증가 */
  overflow: visible;
  position: relative;
  min-height: 200px; /* 카드가 제대로 보이도록 최소 높이 설정 */
`;

export const TarotCard = styled.img`
  width: 126px;
  height: 177px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  
  &:hover {
    transform: scale(1.15);
    z-index: 50;
    filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5));
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

export const SwipeInstruction = styled.p`
  font-size: 1rem;
  color: #ffffff;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
`;
