import styled from 'styled-components'
import bgImage from '../../../assets/images/bg_1.jpg'

// 공통 배경과 오버레이
export const CommonWrapper = styled.div`
  position: relative;
  height: 100vh;
  background-color: #000;
  background-image:
  linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),
  url(${bgImage});
  background-size: contain;
  background-position: center top;
  background-repeat: no-repeat;
  overflow: hidden;
`;

export const CommonOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.25) 0%,
    rgba(0, 0, 0, 0.55) 50%,
    rgba(0, 0, 0, 0.85) 100%
  );
`;

// 공통 타로 마스코트
export const CommonTaruMascot = styled.img`
  position: absolute;
  top: 53%;
  left: 60%;
  transform: rotate(2.781deg);
  width: 147px;
  height: 188px;
  aspect-ratio: 114 / 127;
  flex-shrink: 0;
  object-fit: contain;
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.45));
  user-select: none;
  pointer-events: none;
  z-index: 999;
`;

// 공통 말풍선 헤더
export const CommonBubbleHeader = styled.div`
  position: absolute;
  top: 560px;
  left: 50%;
  transform: translateX(-50%);
  width: 344px;
  height: 55px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--color-neutral-whitegray, #F0F0F0);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding-left: 17px;
  gap: 17px;
  z-index: 15;

  .name {
    color: var(--color-primary-purple, #271932);
    text-align: center;
    font-family: MaruBuriOTF;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 17px;
    letter-spacing: -0.5px;
  }

  .role {
    color: var(--color-neutral-black, #2A2A2A);
    text-align: center;
    font-family: MaruBuriOTF;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: -0.5px;
  }
`;

// 공통 말풍선 컨텐츠
export const CommonBubbleContent = styled.div`
  position: absolute;
  bottom: 0px;
  width: 375px;
  height: 205px;
  flex-shrink: 0;
  background: rgba(138, 138, 138, 0.40);
  color: #FFFFFF;
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  .text {
    font-family: MaruBuriOTF;
    font-size: 14px;
    line-height: 1.8;
    color: #FFFFFF;
    flex: 1;
    display: flex;
    align-items: flex-start;
    padding-top: 10px;
  }

  .next-indicator {
    align-self: flex-end;
    font-size: 18px;
    font-weight: bold;
    color: #FFFFFF;
    margin-top: auto;
    pointer-events: none;
  }
`;

// 공통 네비게이션 버튼
export const CommonButtonPrev = styled.button`
  position: absolute;
  left: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  color: #FFF;
  border: 1px solid rgba(255, 255, 255, 0.7);
  font-size: 22px;
  line-height: 48px;
  text-align: center;
  backdrop-filter: blur(2px);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.9);
  }

  &::before {
    content: '‹';
    font-size: 24px;
    font-weight: bold;
  }
`;

export const CommonButtonNext = styled.button`
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #271932;
  color: #FFF;
  border: none;
  font-size: 24px;
  line-height: 56px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3a1f4a;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
`;
