import PageNavbar from "../components/common/PageNavbar";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { triggerLocationUpdate } from "../hooks/useSelectedLocation";
import Map from "../components/Location/Map";
import { useTranslation } from "react-i18next";


const Background = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 812px;
    width: 375px;
    flex-direction: column;
    display: flex;
    z-index: 9999;
    background: white;
`;

const NavbarContainer = styled.div`
    flex-shrink: 0;
    z-index: 1000;
`;

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
    overflow: hidden;
`;

const AddressInfo = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    height: 200px;
    padding: 20px 16px 50px 16px;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    background-color: white;
`;

const AddressText = styled.div`
    font-size: 24px;
    color: #2A2A2A;
    font-weight: 600;
    margin: 0;
`;

const CoordinateText = styled.div`
    font-size: 16px;
    color: #8A8A8A;
    margin-bottom: 16px;
`;

const SetLocationButton = styled.button`
    width: 100%;
    height: 48px;
    background: #25213B;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:active {
        background: #201b3b;
    }
`;

const LoadingText = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #8A8A8A;
    font-size: 16px;
    z-index: 1001;
`;

const ErrorText = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #FF4444;
    font-size: 16px;
    text-align: center;
    padding: 20px;
    z-index: 1001;
`;

const LocationMap = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapKeyword, setMapKeyword] = useState('');
    const [markerPosition, setMarkerPosition] = useState(null);
    const [address, setAddress] = useState('');

    // 주소에서 구 다음의 세부주소 추출하는 함수
    const extractDetailAddress = (fullAddress) => {
        if (!fullAddress) return '';
        
        // "서울특별시 중구 충무로3가" 형태에서 "충무로3가" 추출
        // 또는 "서울특별시 강남구 역삼동" 형태에서 "역삼동" 추출
        const match = fullAddress.match(/([가-힣]+구)\s+(.+)/);
        if (match && match[2]) {
            return match[2].split(' ')[0]; // 첫 번째 세부주소만 반환
        }
        
        // 구가 없는 경우 마지막 두 단어 반환
        const parts = fullAddress.split(' ');
        if (parts.length >= 2) {
            return parts[parts.length - 1];
        }
        
        return fullAddress;
    };

    // 위치 설정하기 버튼 클릭 핸들러
    const handleSetLocation = () => {
        if (address && markerPosition) {
            const detailAddress = extractDetailAddress(address);
            
            // localStorage에 위치 정보 저장
            localStorage.setItem('selectedLocation', JSON.stringify({
                address: detailAddress,
                fullAddress: address,
                coordinates: markerPosition,
                timestamp: Date.now()
            }));
            
            // 다른 컴포넌트들에게 위치 업데이트 알림
            triggerLocationUpdate();
            
            // 홈으로 이동
            navigate('/', { 
                state: { 
                    locationUpdated: true,
                    newLocation: detailAddress 
                }
            });
        }
    };

    // 마커 위치가 변경될 때 호출되는 함수
    const handleMarkerDragEnd = (newPosition) => {
        setMarkerPosition(newPosition);
        // 좌표를 주소로 변환
        convertCoordinatesToAddress(newPosition.lat, newPosition.lng);
    };

    // 좌표를 주소로 변환하는 함수
    const convertCoordinatesToAddress = (lat, lng) => {
        if (!window.kakao?.maps?.services) return;

        const geocoder = new window.kakao.maps.services.Geocoder();
        
        geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const addressName = result[0]?.address?.address_name || 
                                 result[0]?.road_address?.address_name || 
                                 '주소를 찾을 수 없습니다';
                setAddress(addressName);
                console.log('변환된 주소:', addressName);
                console.log('좌표:', { lat, lng });
            } else {
                setAddress('주소 변환 실패');
                console.error('주소 변환 실패:', status);
            }
        });
    };

    useEffect(() => {
        // URL에서 전달된 위치 정보가 있는지 확인
        if (location.state?.currentLocation) {
            const locationData = location.state.currentLocation;
            setCurrentLocation(locationData);
            setMarkerPosition(locationData);
            // 검색으로 들어온 경우 키워드 검색은 비활성화
            setMapKeyword('');
            setLoading(false);
            // 초기 위치의 주소도 변환
            convertCoordinatesToAddress(locationData.lat, locationData.lng);
            return;
        }

        // 전달된 위치 정보가 없으면 현재 위치 가져오기
        getCurrentLocation();
    }, [location.state]);

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
                setCurrentLocation(locationData);
                setMarkerPosition(locationData);
                setMapKeyword('');
                setLoading(false);
                // 현재 위치의 주소도 변환
                convertCoordinatesToAddress(latitude, longitude);
                console.log('현재 위치:', { latitude, longitude });
            },
            (error) => {
                console.error('위치 정보 오류:', error);
                let errorMessage = '위치 정보를 가져올 수 없습니다.';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '위치 정보 접근이 거부되었습니다.\n브라우저 설정을 확인해주세요.';
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

    return (
        <Background>
            <NavbarContainer>
                <PageNavbar title={t("location.navtitle")} />
            </NavbarContainer>
            <MapContainer>
                {loading && <LoadingText>{t("location.locating")}</LoadingText>}
                
                {error && <ErrorText>{error}</ErrorText>}
                
                {!loading && !error && currentLocation && (
                    <>
                        <Map 
                            currentLocation={currentLocation}
                            centerLocation={currentLocation}
                            markerPosition={markerPosition}
                            onMarkerDragEnd={handleMarkerDragEnd}
                            isDraggable={true}
                        />
                        
                        {/* 주소 정보 표시 */}
                        {address && markerPosition && (
                            <AddressInfo>
                                <AddressText>{address}</AddressText>
                                <CoordinateText>
                                    {t("location.lat")}: {markerPosition.lat.toFixed(6)}, {t("location.lon")}: {markerPosition.lng.toFixed(6)}
                                </CoordinateText>
                                <SetLocationButton onClick={handleSetLocation}>
                                    {t("location.pick")}
                                </SetLocationButton>
                            </AddressInfo>
                        )}
                    </>
                )}
            </MapContainer>
        </Background>
    );
};

export default LocationMap;