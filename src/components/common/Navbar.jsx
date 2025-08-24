import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import LocationIcon from '../../assets/icons/location.svg';
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { languageState } from "../../contexts/recoil/languageState";


const NavbarContainer = styled.div`
    display: flex;
    width: 343px;
    height: 33px;
    justify-content: space-between;
    margin-top: 28px;
    margin-left: 16px;
    font-size: 18px;
    padding-right: 14px;
`;

const LocationBar = styled.div`
    display: flex;
    width: fit-content;
    height: 100%;
    gap: 7px;
    align-items: center;
    color: ${({ $color }) => $color || "white"};
    cursor: pointer;
    transition: opacity 0.2s ease;
    
    &:hover {
        opacity: 0.7;
    }
    
    &:active {
        opacity: 0.5;
    }
`;

const ButtonBar = styled.div`
    display: flex;
    height: 100%;
    width: fit-content;
    justify-content: space-between;
    align-items: center;
`;

const NowLocation = styled.div`
    font-weight: 600;
    font-size: 20px;
`;

// 언어 전환 스위치 컨테이너
const LanguageSwitchContainer = styled.div`
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);
`;

// 스위치 내부 슬라이더
const SwitchSlider = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 30px;
    border-radius: 18px;
    background: ${props => props.$isActive ? '#FFC500' : 'transparent'};
    transition: all 0.3s ease;
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.$isActive ? '#333' : 'rgba(255, 255, 255, 0.8)'};
`;

// 전체 스위치 래퍼
const LanguageSwitch = styled.div`
    display: flex;
    border-radius: 20px;
    overflow: hidden;
`;

const Navbar = ({ LocationBarColor }) => {
    const navigate = useNavigate();
    const [currentLocationName, setCurrentLocationName] = useState('충무로 3가');
    const [lang, setIsKorean] = useRecoilState(languageState);
    const isKorean = lang === 'ko';
    // const [isKorean, setIsKorean] = useState(true); // 언어 상태 (true: KOR, false: ENG)

    const { t, i18n } = useTranslation();

    // 첫 마운트 시 저장된 언어/전역값과 동기화
    useEffect(() => {
        const saved = localStorage.getItem("language");
        const initialLang = saved || lang || "ko";
        // setLang(initialLang);
        i18n.changeLanguage(initialLang);
        setIsKorean(initialLang);
    }, []);

    const handleLanguageSwitch = () => {
        const newLang = isKorean ? "en" : "ko"; // 토글 상태에 따라 언어 결정
        // setIsKorean(!isKorean);
        setIsKorean(newLang); // Recoil 상태 업데이트
        i18n.changeLanguage(newLang); // i18n 언어 변경
        localStorage.setItem("language", newLang); // localStorage에 언어 상태 저장
    };

    // 컴포넌트 마운트 시 localStorage에서 위치 정보 로드
    useEffect(() => {
        const savedLocation = localStorage.getItem('selectedLocation');
        if (savedLocation) {
            try {
                const locationData = JSON.parse(savedLocation);
                if (locationData.address) {
                    setCurrentLocationName(locationData.address);
                }
            } catch (error) {
                console.error('저장된 위치 정보 파싱 오류:', error);
            }
        }
    }, []);

    // localStorage 변경 감지 (다른 탭에서 위치가 변경된 경우)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'selectedLocation' && e.newValue) {
                try {
                    const locationData = JSON.parse(e.newValue);
                    if (locationData.address) {
                        setCurrentLocationName(locationData.address);
                    }
                } catch (error) {
                    console.error('localStorage 변경 감지 오류:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLocationClick = () => {
        navigate('/location');
    };

    return (
        <NavbarContainer>
            <LocationBar $color={LocationBarColor} onClick={handleLocationClick}>
                <img src={LocationIcon} alt="Location" />
                <NowLocation>{currentLocationName}</NowLocation>
                <FontAwesomeIcon icon={faChevronDown} />
            </LocationBar>
            <ButtonBar>
                <LanguageSwitchContainer onClick={handleLanguageSwitch}>
                    <LanguageSwitch>
                        <SwitchSlider $isActive={!isKorean}>ENG</SwitchSlider>
                        <SwitchSlider $isActive={isKorean}>KOR</SwitchSlider>
                    </LanguageSwitch>
                </LanguageSwitchContainer>
            </ButtonBar>
        </NavbarContainer>
    );
};

export default Navbar;