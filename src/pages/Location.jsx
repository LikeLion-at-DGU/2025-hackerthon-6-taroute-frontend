import PageNavbar from "../components/common/PageNavbar";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocationSearch } from "../apis/searchApi";
import searchIcon from '../assets/icons/search.svg';
import nowLocation from '../assets/icons/nowLocation.svg';
import { useTranslation } from "react-i18next";


const LocationContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 343px;
    h2{
        color: #2A2A2A;
        font-size: 22px;
    }
`;

const Background = styled.div`
    height: 100%;
    width: 100%;
    background-color: white;
    flex-direction: column;
    display: flex;
    align-items: center;
    overflow-x: hidden;
`;

const SearchInputContainer = styled.div`
    position: relative;
    width: 100%;
    margin-top: 16px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 48px 12px 16px;
    border: 1px solid black;
    border-radius: 15px;
    outline: none;
    font-size: 14px;
    background: transparent;
    &::placeholder { color: #8A8A8A; }
    color: black;
    font-weight: 400;
    box-sizing: border-box;
    margin-bottom: 10px;
`;

const SearchIconButton = styled.button`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;
    
    &:hover {
        opacity: 0.7;
    }
    
    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    
    img {
        width: 20px;
        height: 20px;
    }
`;

const SearchForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const CurrentLocationButton = styled.button`
    width: 100%;
    padding: 10px 16px;
    background: white;
    color: #8A8A8A;
    border: 1px solid #8A8A8A;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
        background: #f8f8f8;
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ResultsContainer = styled.div`
    width: 100%;
    margin-top: 20px;
    margin-left: calc((100% - 343px) / -2);
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 16px;
    box-sizing: border-box;
    
    /* 스크롤바 스타일링 (webkit 기반 브라우저) */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
        
        &:hover {
            background: #a1a1a1;
        }
    }
`;

const LocationItem = styled.div`
    padding: 12px;
    width: 375px;
    margin: 0 auto 8px auto;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid #F5F5F5;
    
    &:hover {
        background-color: #F5F5F5;
    }
`;

const LocationName = styled.div`
    font-weight: 500;
    color: #2A2A2A;
    margin-bottom: 4px;
`;

const LocationAddress = styled.div`
    font-size: 14px;
    color: #8A8A8A;
`;

const LoadingText = styled.div`
    text-align: center;
    color: #8A8A8A;
    margin-top: 20px;
`;

const ErrorText = styled.div`
    text-align: center;
    color: #FF4444;
    margin-top: 20px;
`;

const Location = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false); // 검색 버튼이 눌렸는지 추적

    const getCurrentLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationData = { lat: latitude, lng: longitude };
                
                // LocationMap 페이지로 이동하면서 위치 정보 전달
                navigate('/location-map', {
                    state: {
                        currentLocation: locationData,
                        mapKeyword: '' // 현재 위치이므로 키워드 없음
                    }
                });
                
                setLoading(false);
                console.log('현재 위치:', { latitude, longitude });
            },
            (error) => {
                console.error('위치 정보 오류:', error);
                let errorMessage = '위치 정보를 가져올 수 없습니다.';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '위치 정보 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '위치 정보를 사용할 수 없습니다.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '위치 정보 요청이 시간 초과되었습니다.';
                        break;
                }
                
                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5분간 캐시
            }
        );
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
        // 입력값이 변경되면 검색 상태 초기화
        setHasSearched(false);
        setLocations([]);
        setError(null);
    };

    const searchLocations = async (query) => {
        setLoading(true);
        setError(null);
        setHasSearched(true); // 검색 버튼이 눌렸음을 표시
        
        try {
            const response = await getLocationSearch(query);
            console.log('API Response:', response);
            console.log('Response type:', typeof response);
            
            let locationData = [];
            
            // API 응답이 address_list 배열로 오는 경우
            if (response && Array.isArray(response.address_list)) {
                locationData = response.address_list;
            } else if (Array.isArray(response)) {
                locationData = response;
            } else if (response && Array.isArray(response.data)) {
                locationData = response.data;
            } else if (response && response.results && Array.isArray(response.results)) {
                locationData = response.results;
            }
            
            console.log('Parsed location data:', locationData);
            console.log('Location data length:', locationData.length);
            
            setLocations(locationData);
        } catch (err) {
            console.error('Location search error:', err);
            setError('위치 검색 중 오류가 발생했습니다.');
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = () => {
        if (searchValue.trim()) {
            searchLocations(searchValue.trim());
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearchClick();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleLocationSelect = (location) => {
        console.log('Selected location:', location);
        
        // LocationMap 페이지로 이동하면서 선택된 위치 정보 전달
        const locationData = { 
            lat: parseFloat(location.y), 
            lng: parseFloat(location.x) 
        };
        
        navigate('/location-map', {
            state: {
                currentLocation: locationData,
                mapKeyword: location.address_name
            }
        });
    };

    return (
        <Background>
        <PageNavbar title={t("location.title")} />
        <LocationContainer>
            {/* <Map keyword="이태원 맛집" /> */}
            <h2>{t("location.subtitle")} <br />{t("location.subtitle2")}</h2>
            <SearchForm onSubmit={handleSubmit}>
                <SearchInputContainer>
                    <Input
                        type="text"
                        placeholder={t("location.searchbar")}
                        value={searchValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoFocus={true}
                        inputMode="search"
                    />
                    <SearchIconButton 
                        type="button"
                        onClick={handleSearchClick}
                        disabled={!searchValue.trim()}
                    >
                        <img src={searchIcon} alt="검색" />
                    </SearchIconButton>
                </SearchInputContainer>
                
                <CurrentLocationButton 
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={loading}
                >
                    <img src={nowLocation} />
                    {t("location.now")}
                </CurrentLocationButton>
            </SearchForm>


            {/* 검색 결과 표시 */}
            {loading && <LoadingText>{t("location.search")}</LoadingText>}
            
            {error && <ErrorText>{error}</ErrorText>}
            
            {!loading && !error && locations.length === 0 && hasSearched && (
                <LoadingText>{t("location.nolocation")}</LoadingText>
            )}
            
            {locations.length > 0 && (
                <ResultsContainer>
                    {locations.map((location, index) => {
                        console.log(`Location ${index}:`, location);
                        
                        return (
                            <LocationItem 
                                key={index} 
                                onClick={() => handleLocationSelect(location)}
                            >
                                <LocationName>{location.address_name || '위치명 없음'}</LocationName>
                                <LocationAddress>
                                    {location.address_name}
                                </LocationAddress>
                            </LocationItem>
                        );
                    })}
                </ResultsContainer>
            )}
        </LocationContainer>
        </Background>
    );
};

export default Location;