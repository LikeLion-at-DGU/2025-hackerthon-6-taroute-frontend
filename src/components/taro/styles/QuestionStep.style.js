import styled from 'styled-components'
import bgImage from '../../../assets/images/bg_1.jpg'

// 공통 배경과 오버레이
export const CommonWrapper = styled.div`
  position: relative;
  height: 100vh;
  background-color: #000;
  background-image: url(${bgImage});
  background-size: contain;
  background-position: center top;
  background-repeat: no-repeat;
  overflow: hidden;
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
