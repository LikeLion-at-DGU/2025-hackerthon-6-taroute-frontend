import styled from 'styled-components'
import { CommonWrapper, CommonOverlay } from './CommonStep.style.js'

export const Wrapper = CommonWrapper
export const Overlay = CommonOverlay

export const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 0 96px; /* 하단 버튼 공간 확보 */
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h1`
  margin-top: 40px;
  margin-bottom: 24px;
  color: #FFFFFF;
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.5px;
`

export const Grid = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 168px);
  justify-content: center;
  gap: 20px 20px;
  margin: 8px auto 0;
`

export const Card = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 168px;
  height: 230px;
  border-radius: 12px;
  background-color: transparent;
  background-image: url(${props => props.bg || 'none'});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  /* 배경 SVG가 프레임을 포함하므로 외곽선 제거 */
  border: none;
  box-shadow: 0 10px 24px rgba(0,0,0,0.35);
  cursor: pointer;
  margin: 0 auto;
  overflow: hidden;
  padding-top: 45px;

`

export const CardBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: #86862A;
  font-family: MaruBuriOTF;
  font-weight: 700;
  font-size: 14px;
  padding-top: 15px;
  line-height: 1;
  z-index: 2;
  pointer-events: none;
`

export const CardImage = styled.img`
width: 107px;
height: 118px;

  object-fit: cover;
  margin-top: 0;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.25);
`

export const CardFooter = styled.div`
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  gap: 8px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 15px;
`

// Heart text style removed (using svg)

export const FooterLabel = styled.div`
  flex: 1;
  background: #EBD8B6;
  color: #271932;
  height: 22px;
  padding: 0 10px;
  font-family: MaruBuriOTF;
  font-size: 12px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

export const HeartButton = styled.button`
  width: 22px;
  height: 22px;
  border: none;
  padding: 6px 5px;
  background: #EBD8B6;
  color: #271932;
  display: inline-flex;
  cursor: pointer;

  box-shadow: 0 2px 0 rgba(0,0,0,0.05) inset;
  position: relative;
  transition: transform .12s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  &:active { transform: scale(0.98); }
`

export const HeartSvg = styled.img`
  width: 14px;
  height: 12px;
  position: absolute;
  inset: 0;
  margin: auto;
  pointer-events: none;
  opacity: 1;
`


export const ChevronRight = styled.button`
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.9);
  color: #271932;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  z-index: 20;
  cursor: pointer;
`

export const ChevronLeft = styled(ChevronRight)`
  left: -8px;
  right: auto;
`

export const Instruction = styled.p`
  margin: 20px 0 12px;
  color: #FFFFFF;
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 18px;
  opacity: 0.95;
`

