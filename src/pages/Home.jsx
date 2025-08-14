import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SearchBar from '../components/common/SearchBar';
import Ads from '../components/Home/Ads';
import WhiteBox from '../components/Home/WhiteBox';
import taru from '../assets/icons/taru.png';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: fit-content;
    background-color: #271932;
    color: #F0F0F0;
`;

const GoTaro = styled.div`
    display: flex;
    width: 100%;
    background-color: #271932;
    justify-content: space-around;
    padding: 10px 10px 32px 10px;
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
`;

const Home = () => {
    const navigate = useNavigate();
    return (
        <HomeContainer>
            <Navbar />
            <SearchBar
                asButton /* 버튼 모드 ON */
                onClick={() => navigate('/search')}
            />
            <GoTaro onClick={() => navigate('/Taro')}>
                <p>무엇을 할지 모르겠다면? <br/>
                <span style={{color: '#C6F62C' }}>놀거리 타로 보기</span></p>
                <img src={taru} alt="타루" style={{ height: 110 }} />
            </GoTaro>
            <WhiteBox />
        </HomeContainer>
    );
};

export default Home;
