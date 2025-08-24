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
  
  /* 다시보기 카드만 시각적으로 살짝 축소 (그리드 간격은 유지) */
  transform: ${props => props.isRetry ? 'scale(0.92)' : 'none'};
  transform-origin: center center;
  transition: transform .15s ease;

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
  padding: 0 0px;
  font-family: MaruBuriOTF;
  font-size: 10px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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


// Detail modal styles
export const DetailOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
`

export const DetailCard = styled.div`
  position: relative;
  width: 360px;
  max-width: calc(100% - 32px);
  border-radius: 16px;
  
  background-image: url(${props => props.bg || 'none'});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center top;
  padding: 28px 20px 20px;
`

export const DetailInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export const DetailImage = styled.img`
  width: 170px;
  height: 170px;
  margin-top: 20px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.35);
`

export const DetailTitle = styled.h2`
  margin: 0;
  color: var(--color-neutral-black, #2A2A2A);
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.5px;
  max-width: 90%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: keep-all;
  margin-top: -6px; /* 텍스트 블록을 위로 살짝 올림 */
  padding-left: 10px;
  padding-right: 10px;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: -6px;
`

export const GoogleRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #FFD700;
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-family: MaruBuriOTF;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

export const DetailDesc = styled.p`
  margin: 0;
  color: var(--color-neutral-black, #2A2A2A);
  font-family: MaruBuriOTF;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.5px;
  text-align: center;
  max-width: 80%;
  word-break: keep-all;
  overflow-wrap: anywhere;
  margin-top: -10px; /* 설명을 조금 더 위로 */
  padding-left: 10px;
  padding-right: 10px;
`

export const DetailFooter = styled.div`
  margin-top: 4px;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
`

export const SmallButton = styled.button`
display: flex;
width: 175px;
height: 32px;
padding: 5px;
justify-content: center;
align-items: center;
gap: 10px;
flex-shrink: 0;
border-radius: 10px;
background: #D6BC87;
border: none;
`

export const DetailPager = styled.div`
  position: fixed;
  left: 50%;
  bottom: 150px;
  transform: translateX(-50%);
 
  display: inline-flex;
  height: 39px;
  padding: 10px 49px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  color: #FFF;
  border-radius: 10px;
  background: var(--color-primary-purple, #25213B);
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 18px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.5px;
  font-style: normal;
  z-index: 1600;
`

export const DetailHeartButton = styled.button`
display: flex;
width: 28px;
height: 28px;
padding: 6px 5px;
justify-content: center;
align-items: center;
gap: 10px;
flex-shrink: 0;
border-radius: 0px;
border: none;
background: #D6BC87;
background: url(<path-to-image>) lightgray 50% / cover no-repeat, radial-gradient(50% 50% at 50% 50%, #F4E4C1 0%, #E0CFA8 100%), rgba(140, 107, 66, 0.20);
background-blend-mode: multiply, normal, overlay;
  
  cursor: pointer;
`

export const DetailHeartSvg = styled.img`
  width: 20px;
  height: 20px;
  pointer-events: none;
`

export const TaroButton = styled.button`
  display: flex;
  width: 343px;
  height: 51px;
  padding: 14px 112px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: var(--color-primary-purple, #271932);
  color: var(--color-neutral-white, #FFF);
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 23px;
  letter-spacing: -0.5px;
  border: none;
  cursor: pointer;
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1200;
`

// 타로 종료 모달 스타일
export const ExitModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`

export const ExitModal = styled.div`
  width: 320px;
  max-width: calc(100% - 32px);
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`

export const ExitModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`

export const ExitModalContent = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

export const ExitModalTitle = styled.h2`
  margin: 0 0 12px 0;
  color: #2A2A2A;
  font-family: MaruBuriOTF;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
`

export const ExitModalDescription = styled.p`
  margin: 0;
  color: #666;
  font-family: MaruBuriOTF;
  font-size: 14px;
  line-height: 1.4;
`

export const ExitModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

export const ExitModalButton = styled.button`
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  font-family: MaruBuriOTF;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.$primary ? '#271932' : '#F0F0F0'};
  color: ${props => props.$primary ? '#FFFFFF' : '#666'};
  
  &:hover {
    opacity: 0.9;
  }
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

