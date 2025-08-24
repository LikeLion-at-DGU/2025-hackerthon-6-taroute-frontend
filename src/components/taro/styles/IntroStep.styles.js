import styled from 'styled-components'
import bgImage from '../../../assets/images/bg_2.jpg'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 24px;
  color: #ffffff;
  overflow: hidden;
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center top;
  filter: brightness(0.80) blur(2px);
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.55) 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
`;

export const Title = styled.h1`
  margin: 0;
  margin-top: 152px;
  text-align: center;
  font-family: MaruBuriOTF;
  font-weight: 700;
  font-size: 36px;
  line-height: 1.25;
  letter-spacing: -0.3px;
  color: #FFFFFF;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
`;

export const Description = styled.p`
  margin: 80px 0 0;
  text-align: center;
  font-family: MaruBuriOTF;
  font-size: 15px;
  line-height: 1.8;
  color: #FFFFFF;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
`;

export const Button = styled.button`
  display: flex;
  width: 343px;
  height: 51px;
  padding: 14px 112px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: #25213B;
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
  z-index: 9999;
`;

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
    font-family: MaruBuriOTF;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
  }
`;
