import styled from 'styled-components'
import {
  CommonWrapper,
  CommonOverlay,
  CommonTaruMascot,
  CommonBubbleHeader,
  CommonBubbleContent,
  CommonButtonPrev,
  CommonButtonNext
} from './CommonStep.style.js'

// ConfirmStep 전용 스타일이 필요한 경우 여기에 추가
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
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &::before {
    content: "<";
    color: #FFFFFF;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
  }
`;

export const HomeButton = styled.button`
  position: absolute;
  top: 20px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &::before {
    color: #FFFFFF;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
  }
`;
