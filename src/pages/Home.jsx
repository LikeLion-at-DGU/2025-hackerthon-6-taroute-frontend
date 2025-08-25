import { useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import Ads from '../components/Home/Ads';
import WhiteBox from '../components/Home/WhiteBox';
import taru from '../assets/icons/taru/taruHome.png';
import { useTranslation } from 'react-i18next';

const HomeContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: fit-content;
    color: #F0F0F0;
    min-height: 100%;
`;


const GoTaro = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 7px 10px 32px 15px;
    font-weight: 600;
    font-size: 24px;
    margin-bottom: 30px;
`;

const GoTaroText = styled.p`
    margin: 0 0 18px 0;
    line-height: 1.2;
    padding-left: ${({ $isKo }) => ($isKo ? "0px" : "10px")};
`;

const GoTaroButton = styled.div`
    display: flex;
    width: 343px;
    cursor: pointer;
    height: 180px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: rgba(0, 0, 0, 0.505);
    border-radius: 20px;
    font-weight: 300;
    font-size: 20px;
    p{
        padding-bottom: 5px;
        line-height: 1.4;
        margin-left: ${({ $isKo }) => ($isKo ? "0px" : "0px")};
        padding-right: 0px;
        width: ${({ $isKo }) => ($isKo ? "200px" : "190px")};
    }
`;

const Home = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isKo = i18n.language?.startsWith("ko");

    return (
        <HomeContainer>
            <div>
                <SearchBar
                    asButton
                    onClick={() => navigate('/search')}
                />
            </div>
            <GoTaro>
                <GoTaroText $isKo={isKo}> 
                    {t("home.title")}
                    <br/>
                    {t("home.title2")}
                </GoTaroText>
                <GoTaroButton $isKo={isKo} onClick={() => navigate('/taro')}>
                    <p>{t("home.what")} <br />
                        <span style={{ fontSize: "24px", color: "#FFC500", fontWeight: "500", marginRight:"10px" }}>
                            {t("home.taro")} &gt;</span></p>
                    <img src={taru} />
                </GoTaroButton>
            </GoTaro>

            <WhiteBox expandedTop={105} collapsedTop={390} />
        </HomeContainer>
    );
};

export default Home;
