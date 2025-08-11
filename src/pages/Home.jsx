import { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/common/Navbar';

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
        </HomeContainer>
    );
};

export default Home;
