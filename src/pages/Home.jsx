import { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/common/Navbar';
import SearchBar from '../components/common/SearchBar';
import Ads from '../components/Home/Ads';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #271932;
    color: #F0F0F0;
`;

const Home = () => {
    return (
        <HomeContainer>
            <Navbar />
            <SearchBar
                asButton  // 버튼 모드 ON
                onClick={() => navigate('/search')}
            />
            <Ads />
        </HomeContainer>
    );
};

export default Home;
