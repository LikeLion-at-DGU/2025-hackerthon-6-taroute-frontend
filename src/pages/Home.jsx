import { useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import Ads from '../components/Home/Ads';
import WhiteBox from '../components/Home/WhiteBox';
import taru from '../assets/icons/taru/taruHome.png';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: fit-content;
    color: #F0F0F0;
`;


const GoTaro = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 7px 10px 32px 15px;
    font-weight: 600;
    font-size: 24px;
    p{
        margin: 0 0 18px 0;
        line-height: 1.2;
    }
    margin-bottom: 30px;
`;

const GoTaroButton = styled.div`
    display: flex;
    width: 343px;
    cursor: pointer;
    height: 180px;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background-color: rgba(0, 0, 0, 0.505);
    border-radius: 20px;
    font-weight: 300;
    font-size: 20px;
    p{
        padding-bottom: 5px;
        line-height: 1.4;
    }
`;

const Home = () => {
    const navigate = useNavigate();
    return (
        <HomeContainer>
            <div>
                <SearchBar
                    asButton
                    onClick={() => navigate('/search')}
                />
            </div>
            <GoTaro>
                <p>오늘의 운명은 <br /> 어디로 향하고 있을까요?</p>
                <GoTaroButton onClick={() => navigate('/taro')}>
                    <p>무엇을 할지 모를 때는 <br />
                        <span style={{ fontSize: "24px", color: "#FFC500", fontWeight: "500" }}>
                            타로점 확인하기 &gt;</span></p>
                    <img src={taru} />
                </GoTaroButton>
            </GoTaro>

            <WhiteBox expandedTop={36} collapsedTop={330} />
        </HomeContainer>
    );
};

export default Home;
