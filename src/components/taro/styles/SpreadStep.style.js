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
