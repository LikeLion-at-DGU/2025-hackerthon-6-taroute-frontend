import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import LocationIcon from '../../assets/icons/location.svg';
import CartIcon from '../../assets/icons/cart.svg';
import HomeIcon from '../../assets/icons/home.svg';


const NavbarContainer = styled.div`
    display: flex;
    width: 343px;
    height: 33px;
    justify-content: space-between;
    margin-top: 28px;
    margin-left: 16px;
    font-size: 18px;
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
    width: 67px;
    justify-content: space-between;
    align-items: center;
`;

const NowLocation = styled.div`
    font-weight: 600;
    font-size: 20px;
`;

const Navbar = ({ LocationBarColor }) => {
    const navigate = useNavigate();
    const [currentLocationName, setCurrentLocationName] = useState('충무로 3가');

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
                <img src={CartIcon} alt="Cart" />
                <img src={HomeIcon} alt="Home" />
            </ButtonBar>
        </NavbarContainer>
    );
};

export default Navbar;