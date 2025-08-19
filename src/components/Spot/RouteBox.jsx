import styled from "styled-components";
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faTrainSubway } from "@fortawesome/free-solid-svg-icons";
import { faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { useSavedPlaceContext } from '../../contexts/SavedPlaceContext';
import { getRouteInfo } from '../../apis/routeApi';
import goRight from "../../assets/icons/spot/goRight.svg";
import goLeft from "../../assets/icons/spot/goLeft.svg";


const Container = styled.div`
    width: 343px;
    height: 122px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    position: relative;
`;

const NavigationButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${props => props.disabled ? 0.3 : 1};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    
    &.left {
        left: -12px;
    }
    
    &.right {
        right: -12px;
    }
    
    img {
        width: 20px;
        height: 20px;
    }
    
    &:hover {
        opacity: ${props => props.disabled ? 0.3 : 0.7};
    }
`;

const RouteBoxContainer = styled.div`
    width: 343px;
    height: 122px;
    display: flex;
    border-radius: 10px;
    border: 1px solid #8A8A8A;
    background-color: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    flex-direction: column;
    padding-left: 16px;
`;

const Header = styled.div`
    display: flex;
    margin-top: 12px;
    gap: 20px;
    align-items: center;
    flex-wrap: nowrap;
`;

const OriginDesination = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 15px;
    color: #2A2A2A;
    font-weight: 700;
    flex-shrink: 0;
    white-space: nowrap;
`;

const RoutePoint = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    white-space: nowrap;
`;

const IndexNumber = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => {
        // 인덱스별 색상 지정 (1~10번)
        const colors = [
            '#e06d6d', // 1번
            '#e09b6d', // 2번
            '#d9e06d', // 3번
            '#aee06d', // 4번
            '#6de09a', // 5번
            '#6ddfe0', // 6번
            '#6d95e0', // 7번
            '#9a6de0', // 8번
            '#e06ddf', // 9번
            '#e06d95'  // 10번
        ];

        return colors[(props.$index - 1) % 10] || '#25213B';
    }};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    flex-shrink: 0;
`;

const Origin = styled.span`
    font-size: 15px;
    color: #2A2A2A;
    font-weight: 700;
    font-family: MaruBuri;
`;

const Destination = styled.span`
    font-size: 15px;
    color: #2A2A2A;
    font-weight: 700;
    font-family: MaruBuri;
`;

const SelectTransportation = styled.div`
    display: flex;
    justify-content: space-around;
    height: 23px;
    width: 146px;
    border: 0.5px solid #8A8A8A;
    border-radius: 15px;
    background: white;
    align-items: center;
    font-size: 13px;
`;

const TransportIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    color: ${props => props.selected ? '#2A2A2A' : '#8A8A8A'};
    transition: color 0.2s ease;
    
    &:hover {
        color: ${props => props.selected ? '#2A2A2A' : '#666'};
    }
`;


const RouteInfo = styled.div`
    margin-top: 4px;
    margin-left: 4px;
`;

const Title = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #8A8A8A;
    margin: 8px 0 2px 0;
    line-height: 1.2;
`;

const InfoBox = styled.div`
    display: flex;
    font-size: 18px;
    font-weight: 600;
    color: #2A2A2A;
    align-items: center;
    margin-top: 0;
    line-height: 1.2;
    p{
        color: #8A8A8A;
        font-weight: 300;
        margin: 0;
    }
    gap: 20px;
`;

const Time = styled.div`
    display: flex;
    align-items: baseline;
    p{
        font-size:28px;
        font-weight: 600;
        color: #2a2a2a;
        margin: 0;
    }
`;

const Distance = styled.div`
    display: flex;
`;

const Steps = styled.div`
    display: flex;
`;

const RouteBox = () => {
    const [selectedTransport, setSelectedTransport] = useState('walk');
    const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
    const [routeData, setRouteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { savedPlaces } = useSavedPlaceContext();

    // 활성화된 장소들만 필터링
    const enabledPlaces = savedPlaces.filter(place => place.isEnabled !== false);

    // 루트 쌍 생성 (1->2, 2->3, 3->4 등)
    const routes = [];
    for (let i = 0; i < enabledPlaces.length - 1; i++) {
        routes.push({
            origin: enabledPlaces[i],
            destination: enabledPlaces[i + 1],
            originIndex: i + 1,
            destinationIndex: i + 2
        });
    }

    // 현재 보여줄 루트
    const currentRoute = routes[currentRouteIndex];

    // API 호출 함수
    const fetchRouteData = useCallback(async (route, transport) => {
        if (!route || !route.origin || !route.destination) {
            console.log('Invalid route data:', route);
            return;
        }

        console.log('🚀 fetchRouteData 호출:', {
            route: route,
            transport: transport,
            origin: route.origin,
            destination: route.destination,
            originKeys: route.origin ? Object.keys(route.origin) : null,
            destinationKeys: route.destination ? Object.keys(route.destination) : null
        });

        // 좌표 정보 확인 - location 객체 안에 있는 좌표 정보 추출
        const originCoords = {
            longitude: route.origin.location?.longitude || route.origin.longitude || route.origin.x || route.origin.lng || route.origin.long,
            latitude: route.origin.location?.latitude || route.origin.latitude || route.origin.y || route.origin.lat,
        };
        
        const destinationCoords = {
            longitude: route.destination.location?.longitude || route.destination.longitude || route.destination.x || route.destination.lng || route.destination.long,
            latitude: route.destination.location?.latitude || route.destination.latitude || route.destination.y || route.destination.lat,
        };

        console.log('📍 추출된 좌표:', {
            originCoords: originCoords,
            destinationCoords: destinationCoords,
            originValidation: {
                hasLongitude: !!originCoords.longitude,
                hasLatitude: !!originCoords.latitude,
                longitudeValue: originCoords.longitude,
                latitudeValue: originCoords.latitude,
                longitudeType: typeof originCoords.longitude,
                latitudeType: typeof originCoords.latitude
            },
            destinationValidation: {
                hasLongitude: !!destinationCoords.longitude,
                hasLatitude: !!destinationCoords.latitude,
                longitudeValue: destinationCoords.longitude,
                latitudeValue: destinationCoords.latitude,
                longitudeType: typeof destinationCoords.longitude,
                latitudeType: typeof destinationCoords.latitude
            }
        });

        // 좌표가 유효한지 확인
        if (!originCoords.longitude || !originCoords.latitude || 
            !destinationCoords.longitude || !destinationCoords.latitude) {
            console.log('❌ Invalid coordinates:', { originCoords, destinationCoords });
            return;
        }

        const apiParams = {
            origin_x: originCoords.longitude,
            origin_y: originCoords.latitude,
            destination_x: destinationCoords.longitude,
            destination_y: destinationCoords.latitude,
            transport: transport
        };

        console.log('📡 API 호출 파라미터:', apiParams);

        setIsLoading(true);
        try {
            const data = await getRouteInfo(apiParams);
            console.log('✅ API 성공 응답:', {
                rawData: data,
                dataType: typeof data,
                dataKeys: data ? Object.keys(data) : null,
                hasCarRoutes: !!data?.car_routes,
                carRoutes: data?.car_routes,
                carRoutesType: typeof data?.car_routes,
                carRoutesIsArray: Array.isArray(data?.car_routes),
                firstCarRoute: data?.car_routes?.[0],
                firstCarRouteKeys: data?.car_routes?.[0] ? Object.keys(data?.car_routes?.[0]) : null
            });
            setRouteData(data);
        } catch (error) {
            console.error('❌ API 실패:', {
                error: error,
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: error.config,
                apiParams: apiParams
            });
            setRouteData(null);
        } finally {
            console.log('🔄 로딩 상태 해제');
            setIsLoading(false);
        }
    }, []);

    // 교통수단 변경 시 API 호출
    const handleTransportChange = async (transport) => {
        console.log('🚗 handleTransportChange 호출:', {
            transport: transport,
            currentRoute: currentRoute,
            currentRouteExists: !!currentRoute
        });
        
        setSelectedTransport(transport);
        if (transport === 'car' && currentRoute) {
            await fetchRouteData(currentRoute, transport);
        } else {
            setRouteData(null);
        }
    };

    // 루트 변경 시 자동차가 선택되어 있으면 API 호출
    useEffect(() => {
        console.log('🔄 useEffect 호출:', {
            selectedTransport: selectedTransport,
            currentRouteIndex: currentRouteIndex,
            shouldCallAPI: selectedTransport === 'car' && currentRouteIndex < routes.length
        });
        
        if (selectedTransport === 'car' && currentRouteIndex < routes.length) {
            const route = routes[currentRouteIndex];
            fetchRouteData(route, 'car');
        } else {
            setRouteData(null);
        }
    }, [currentRouteIndex, selectedTransport, fetchRouteData]); // fetchRouteData 추가

    const goToPreviousRoute = () => {
        setCurrentRouteIndex(prev => Math.max(0, prev - 1));
    };

    const goToNextRoute = () => {
        setCurrentRouteIndex(prev => Math.min(routes.length - 1, prev + 1));
    };

    // 렌더링 상태 디버깅
    console.log('🎨 RouteBox 렌더링:', {
        selectedTransport: selectedTransport,
        isLoading: isLoading,
        hasRouteData: !!routeData,
        routeData: routeData,
        routeDataKeys: routeData ? Object.keys(routeData) : null,
        currentRoute: currentRoute,
        routesLength: routes.length
    });

    // 루트가 없으면 기본 메시지 표시
    if (routes.length === 0) {
        return (
            <Container>
                <RouteBoxContainer>
                    <Header>
                        <OriginDesination>
                            <Origin>활성화된 장소가 부족합니다</Origin>
                        </OriginDesination>
                    </Header>
                    <RouteInfo>
                        <Title>
                            최소 2개 이상의 장소를 활성화해주세요
                        </Title>
                    </RouteInfo>
                </RouteBoxContainer>
            </Container>
        );
    }

    return (
        <Container>
            <NavigationButton
                className="left"
                onClick={goToPreviousRoute}
                disabled={currentRouteIndex === 0}
            >
                <img src={goLeft} alt="이전 루트" />
            </NavigationButton>

            <RouteBoxContainer>
                <Header>
                    <OriginDesination>
                        <RoutePoint>
                            <Origin>출발</Origin>
                            <IndexNumber $index={currentRoute.originIndex}>
                                {currentRoute.originIndex}
                            </IndexNumber>
                        </RoutePoint>
                        <RoutePoint>
                            <Destination>도착</Destination>
                            <IndexNumber $index={currentRoute.destinationIndex}>
                                {currentRoute.destinationIndex}
                            </IndexNumber>
                        </RoutePoint>
                    </OriginDesination>
                    <SelectTransportation>
                        <TransportIcon
                            icon={faPersonWalking}
                            selected={selectedTransport === 'walk'}
                            onClick={() => handleTransportChange('walk')}
                        />
                        <TransportIcon
                            icon={faTrainSubway}
                            selected={selectedTransport === 'transit'}
                            onClick={() => handleTransportChange('transit')}
                        />
                        <TransportIcon
                            icon={faCar}
                            selected={selectedTransport === 'car'}
                            onClick={() => handleTransportChange('car')}
                        />
                    </SelectTransportation>
                </Header>
                <RouteInfo>
                    <Title>
                        소요시간
                    </Title>
                    <InfoBox>
                        {isLoading ? (
                            <div>로딩 중...</div>
                        ) : selectedTransport === 'car' && routeData?.car_routes?.[0] ? (
                            <>
                                <Time><p>{routeData.car_routes[0].car_duration.replace('분', '')}</p>분</Time>
                                <p style={{fontWeight:'500'}}>|</p>
                                <Distance>{routeData.car_routes[0].distance}</Distance>
                                <p style={{fontWeight:'500'}}>|</p>
                                <Steps>{routeData.car_routes[0].taxi_fare}</Steps>
                            </>
                        ) : (
                            <>
                                <Time><p>12</p>분</Time>
                                <p style={{fontWeight:'500'}}>|</p>
                                <Distance>1.1km</Distance>
                                <p style={{fontWeight:'500'}}>|</p>
                                <Steps>3,600걸음</Steps>
                            </>
                        )}
                    </InfoBox>
                </RouteInfo>
            </RouteBoxContainer>

            <NavigationButton
                className="right"
                onClick={goToNextRoute}
                disabled={currentRouteIndex === routes.length - 1}
            >
                <img src={goRight} alt="다음 루트" />
            </NavigationButton>
        </Container>
    );
};

export default RouteBox;