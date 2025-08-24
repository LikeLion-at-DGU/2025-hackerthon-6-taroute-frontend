import {
  CommonWrapper,
  CommonOverlay,
  CommonTaruMascot,
  CommonBubbleHeader,
  CommonBubbleContent,
  CommonButtonPrev,
  CommonButtonNext
} from './CommonStep.style.js'

// ConsentStep 전용 스타일이 필요한 경우 여기에 추가
export const Wrapper = CommonWrapper
export const Overlay = CommonOverlay
export const TaruMascot = CommonTaruMascot
export const BubbleHeader = CommonBubbleHeader
export const BubbleContent = CommonBubbleContent
export const ButtonPrev = CommonButtonPrev
export const ButtonNext = CommonButtonNext

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &::before {
    content: "‹";
    color: #FFFFFF;
    font-size: 24px;
    font-weight: bold;
  }
`;


