import styled from 'styled-components'
import { CommonWrapper, CommonOverlay } from './CommonStep.style.js'

export const Wrapper = CommonWrapper
export const Overlay = CommonOverlay

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
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 20px;
  margin-top: 8px;
`

export const Card = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 168px;
  height: 230px;
  border-radius: 12px;
  background: rgba(240,240,240,0.95);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 10px 24px rgba(0,0,0,0.35);
  cursor: pointer;
  margin: 0 auto;
  overflow: hidden;
`

export const CardBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  color: #B28BD9;
  font-family: MaruBuriOTF;
  font-weight: 700;
`

export const CardImage = styled.img`
  width: 140px;
  height: 110px;
  object-fit: cover;
  margin-top: 42px;
  border-radius: 6px;
`

export const CardFooter = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.9);
  color: #271932;
  border-radius: 6px;
  padding: 8px 10px;
  font-family: MaruBuriOTF;
  font-size: 14px;
`

export const Heart = styled.span`
  font-size: 16px;
  line-height: 1;
  color: #E87373;
`

export const ChevronRight = styled.button`
  position: absolute;
  right: 12px;
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
`

export const Instruction = styled.p`
  margin: 28px 0 16px;
  color: #FFFFFF;
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 18px;
  opacity: 0.95;
`

export const EndButton = styled.button`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 24px;
  height: 54px;
  border-radius: 12px;
  border: none;
  background: #271932;
  color: #FFFFFF;
  font-family: MaruBuriOTF;
  font-size: 18px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  cursor: pointer;
`


