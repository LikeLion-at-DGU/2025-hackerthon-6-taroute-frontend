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
  justify-content: center;
  color: #ffffff;
  overflow: hidden;
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
  justify-content: center;
  height: 100%;
  z-index: 10;
  position: relative;
`;

export const TaruIcon = styled.img`
  width: 177px;
  height: 197px;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  margin: 0;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.25;
  color: #FFFFFF;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  position: relative;
  z-index: 10;
  margin-bottom: 3rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 10;
`;

export const Button = styled.button`
  padding: 12px 24px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'MaruBuri';
  font-weight: 600;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;
