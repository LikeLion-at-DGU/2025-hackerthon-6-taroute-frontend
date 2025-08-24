import styled from 'styled-components'
import {
  CommonWrapper,
  CommonOverlay,
  CommonTaruMascot,
} from './CommonStep.style.js'

// 공통 스타일 재사용
export const Wrapper = CommonWrapper
export const Overlay = CommonOverlay
// QuestionStep에서는 마스코트 위치를 별도로 조정
export const TaruMascot = styled(CommonTaruMascot)`
  width: 120px;
  height: 160px;
  flex-shrink: 0;
  aspect-ratio: 98/125;
  top: 36px;
  left: 66%;
  transform: rotate(2.781deg);
`

// QuestionStep 전용 스타일
export const QuestionBox = styled.div`
  position: absolute;
    top: 134px;
    left: 16px;
    right: 16px;
    background: rgba(55, 35, 80, 0.95);
    color: #fff;
    border-radius: 16px;
    padding-top: 27px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.35);
`

export const QuestionTitle = styled.div`
  font-family: MaruBuriOTF;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 20px;
  opacity: 0.9;

  color: var(--color-neutral-whitegray, #F0F0F0);
  font-size: 17px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: -0.5px;
  
`

export const QuestionText = styled.div`


color: var(--color-neutral-white, #FFF);
font-family: MaruBuriOTF;
font-size: 17px;
font-style: normal;
font-weight: 600;
line-height: 28px; /* 164.706% */
letter-spacing: -0.5px;
margin-bottom: 15px;
`

export const Options = styled.div`
  position: absolute;
  color: var(--color-neutral-gray, #8A8A8A);
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px; /* 100% */
  letter-spacing: -0.5px;
  left: 16px;
  right: 16px;
  top: 315px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`

export const OptionButton = styled.button`
  display: flex;
  align-items: center;
  display: flex;
  align-self: stretch;
  gap: 29px;
  width: 100%;
  padding: 28px 21px;
  border-radius: 12px;
  border: none;
  background: #F0F0F0;
  color: #2A2A2A;
  font-family: MaruBuriOTF;
  font-size: 18px;
  cursor: pointer;
  text-align: left;

  
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  transition: transform .12s ease, background .12s ease;

  &:active { transform: scale(0.98); }
`

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