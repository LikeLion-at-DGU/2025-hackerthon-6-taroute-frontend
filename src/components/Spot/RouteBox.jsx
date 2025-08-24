import styled from "styled-components";
import { useState, useEffect, useCallback, useMemo } from 'react';
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
    height: ${props => {
        if (props.$isTransit && props.$isExpanded) return 'auto';
        return props.$isTransit ? '180px' : '122px';
    }};
    min-height: ${props => props.$isTransit ? '180px' : '122px'};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 95px;
    position: absolute;
    transition: height 0.3s ease;
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
    height: ${props => {
        if (props.$isTransit && props.$isExpanded) return 'auto';
        return props.$isTransit ? '180px' : '122px';
    }};
    min-height: ${props => props.$isTransit ? '180px' : '122px'};
    display: flex;
    border-radius: 10px;
    border: 1px solid #8A8A8A;
    background-color: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    flex-direction: column;
    padding-left: 16px;
    position: relative;
    transition: height 0.3s ease;
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

// 대중교통 구간 UI 컴포넌트들
const TransitSegmentsContainer = styled.div`
    margin: 4px 16px 0 0;
    padding: 8px 0 0 0;
`;

const SegmentBar = styled.div`
    position: relative;
    width: 100%;
    height: 12px;
    border-radius: 5px;
    overflow: hidden;
    border: 0.3px solid #8A8A8A;
`;

const SegmentPart = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6px;
    font-weight: 600;
    color: #2A2A2A;
    position: relative;
    transition: all 0.2s ease;
    flex-shrink: 0;
    padding: 0 2px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    
    &:hover {
        filter: brightness(1.1);
        z-index: 2;
    }
    
    /* 구분선 제거 - border-radius가 잘 보이도록 */
`;

// 막대 하단 수단 표시용 컴포넌트
const SegmentLabels = styled.div`
    display: flex;
    width: 100%;
`;

const SegmentLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 500;
    color: #666;
    text-align: center;
    padding: 2px;
    margin: 0;
`;

// 자세히 보기 버튼
const DetailToggleButton = styled.button`
    background: none;
    border: none;
    color: #8A8A8A;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 2px 0 0 0;
    align-self: flex-start;
    
    &:hover {
        color: #2A2A2A;
    }
    
    &::after {
        content: "${props => props.$isExpanded ? '▲' : '▼'}";
        font-size: 10px;
        transition: all 0.2s ease;
    }
`;

// 세부 정보 컨테이너
const TransitDetailsContainer = styled.div`
    max-height: ${props => props.$isExpanded ? '300px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-top: ${props => props.$isExpanded ? '20px' : '0'};
    padding-right: 16px;
`;

// 개별 탑승/하차 정보
const TransitStepItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    font-size: 12px;
    color: #2A2A2A;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
        border-bottom: none;
    }
`;

const TransitStepIcon = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${props => props.color || '#666'};
    flex-shrink: 0;
`;

const TransitStepText = styled.div`
    flex: 1;
    line-height: 1.3;
    
    .line-name {
        font-weight: 600;
        margin-right: 4px;
        color: ${props => props.$lineColor || '#2A2A2A'};
    }
    
    .station-name {
        color: #555;
    }
    
    .action {
        color: #8A8A8A;
        font-size: 11px;
        margin-left: 4px;
    }
`;


const RouteBox = ({ onRouteChange, routeInfo, onTransportChange }) => {
    const [selectedTransport, setSelectedTransport] = useState('walk');
    const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
    const [routeData, setRouteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailExpanded, setIsDetailExpanded] = useState(false);
    const { savedPlaces } = useSavedPlaceContext();

    // 활성화된 장소들만 필터링
    const enabledPlaces = useMemo(() => {
        return savedPlaces.filter(place => place.isEnabled !== false);
    }, [savedPlaces]);

    // 루트 쌍 생성 (1->2, 2->3, 3->4 등)
    const routes = useMemo(() => {
        const routeArray = [];
        for (let i = 0; i < enabledPlaces.length - 1; i++) {
            routeArray.push({
                origin: enabledPlaces[i],
                destination: enabledPlaces[i + 1],
                originIndex: i + 1,
                destinationIndex: i + 2
            });
        }
        return routeArray;
    }, [enabledPlaces]);

    // 현재 보여줄 루트
    const currentRoute = useMemo(() => {
        return routes[currentRouteIndex] || null;
    }, [routes, currentRouteIndex]);

    // 루트 변경시 부모 컴포넌트에 알림
    useEffect(() => {
        if (onRouteChange && currentRoute) {
            onRouteChange(currentRoute);
        }
    }, [currentRoute]); // onRouteChange 제거

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

        // walk, transit일 때는 장소 이름도 추가
        if (transport === 'walk' || transport === 'transit') {
            const startName = route.origin.name || route.origin.place_name || route.origin.title || '출발지';
            const endName = route.destination.name || route.destination.place_name || route.destination.title || '도착지';

            apiParams.startName = startName;
            apiParams.endName = endName;

            console.log('🏷️ 장소 이름 확인:', {
                transport: transport,
                origin: route.origin,
                destination: route.destination,
                startName: startName,
                endName: endName
            });
        }

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
            가능한경로개수: routes.length
        });

        setSelectedTransport(transport);

        // 상위 컴포넌트에 교통수단 변경 알림
        if (onTransportChange) {
            onTransportChange(transport);
        }

        // car, walk, transit 선택 시 API 호출
        if ((transport === 'car' || transport === 'walk' || transport === 'transit') && currentRoute) {
            await fetchRouteData(currentRoute, transport);
        } else {
            setRouteData(null);
        }
    };

    // 루트 변경 시 선택된 교통수단에 따라 API 호출
    useEffect(() => {
        console.log('🔄 useEffect 호출:', {
            selectedTransport: selectedTransport,
            currentRouteIndex: currentRouteIndex,
            shouldCallAPI: (selectedTransport === 'car' || selectedTransport === 'walk') && currentRoute
        });

        if ((selectedTransport === 'car' || selectedTransport === 'walk' || selectedTransport === 'transit') && currentRoute) {
            fetchRouteData(currentRoute, selectedTransport);
        } else {
            setRouteData(null);
        }
    }, [currentRouteIndex, selectedTransport, currentRoute, fetchRouteData]);

    const goToPreviousRoute = () => {
        setCurrentRouteIndex(prev => Math.max(0, prev - 1));
    };

    const goToNextRoute = () => {
        setCurrentRouteIndex(prev => Math.min(routes.length - 1, prev + 1));
    };

    // 지하철 호선별 색상 코드
    const subwayLineColors = {
        '1호선': '#0052A4',
        '2호선': '#009D3E',
        '3호선': '#EF7C1C',
        '4호선': '#00A5DE',
        '5호선': '#996CAC',
        '6호선': '#9E4510',
        '7호선': '#5D6519',
        '8호선': '#D6406A',
        '9호선': '#8E764B',
        '수인분당선': '#E0A134',
        '경의중앙선': '#2ABFD0',
        '공항철도': '#0090D2',
        '신분당선': '#BB1834',
        '인천1호선': '#6E98BB',
        '인천2호선': '#ED8B00',
        '경춘선': '#0C8E72',
        '서해선': '#81A914',
        '김포골드라인': '#A17800',
        'GTX-A': '#BB1834', // 신분당선과 동일
        'GTX-B': '#0090D2', // 공항철도와 동일
        'GTX-C': '#009D3E'  // 2호선과 동일
    };

    // 대중교통 세부 정보 렌더링 함수
    const renderTransitDetails = (segments) => {
        if (!segments || segments.length === 0) return null;

        const transitSteps = [];
        
        segments.forEach((segment, index) => {
            if (segment.mode === 'BUS' || segment.mode === 'SUBWAY') {
                let color, lineName;
                
                if (segment.mode === 'BUS') {
                    color = '#4285F4';
                    lineName = `${segment.bus_number}번`;
                } else {
                    // "수도권" 접두사와 "_숫자" 접미사 제거
                    const processedLineName = segment.subway_line?.replace(/^수도권/, '').replace(/_\d+$/, '');
                    color = subwayLineColors[processedLineName] || '#34A853';
                    lineName = processedLineName || '지하철';
                    
                    // 디버깅: 세부 정보에서도 지하철 노선 매핑 확인
                    console.log('🚇 세부정보 지하철 노선 디버깅:', {
                        originalLine: segment.subway_line,
                        processedLine: processedLineName,
                        hasColor: !!subwayLineColors[processedLineName],
                        color: color
                    });
                }
                
                // 탑승 정보
                transitSteps.push({
                    type: 'boarding',
                    mode: segment.mode,
                    lineName: lineName,
                    stationName: segment.mode === 'BUS' ? segment.start_stop : segment.start_station,
                    color: color,
                    key: `${index}-board`
                });
                
                // 하차 정보
                transitSteps.push({
                    type: 'alighting',
                    mode: segment.mode,
                    lineName: lineName,
                    stationName: segment.mode === 'BUS' ? segment.end_stop : segment.end_station,
                    color: color,
                    key: `${index}-alight`
                });
            }
        });

        return (
            <TransitDetailsContainer $isExpanded={isDetailExpanded}>
                {transitSteps.map((step) => (
                    <TransitStepItem key={step.key}>
                        <TransitStepIcon color={step.color} />
                        <TransitStepText $lineColor={step.color}>
                            <span className="line-name">{step.lineName}</span>
                            <span className="station-name">{step.stationName}</span>
                            <span className="action">
                                {step.type === 'boarding' ? '탑승' : '하차'}
                            </span>
                        </TransitStepText>
                    </TransitStepItem>
                ))}
            </TransitDetailsContainer>
        );
    };

    // 대중교통 구간 렌더링 함수
    const renderTransitSegments = (segments) => {
        console.log('🎯 renderTransitSegments 호출:', { segments, length: segments?.length });

        if (!segments || segments.length === 0) {
            console.log('❌ segments가 없거나 비어있음');
            return null;
        }

        // 총 시간 계산 (분)
        const totalTime = segments.reduce((sum, segment) => {
            const timeMatch = segment.section_time?.match(/\d+/);
            const time = timeMatch ? parseInt(timeMatch[0]) : 0;
            console.log('⏱️ 구간 시간 계산:', { segment: segment.mode, time: segment.section_time, parsed: time });
            return sum + time;
        }, 0);

        console.log('📊 총 시간:', totalTime, '분');

        // 구간별 데이터 계산
        const segmentData = segments.map(segment => {
            const timeMatch = segment.section_time?.match(/\d+/);
            const segmentTime = timeMatch ? parseInt(timeMatch[0]) : 0;
            const widthPercent = totalTime > 0 ? (segmentTime / totalTime * 100) : (100 / segments.length);

            let backgroundColor = '#6c757d';
            let labelText = '';

            if (segment.mode === 'BUS') {
                backgroundColor = '#4285F4';
                labelText = segment.bus_number ? `${segment.bus_number}번` : '버스';
            } else if (segment.mode === 'SUBWAY') {
                // "수도권" 접두사와 "_숫자" 접미사 제거
                const lineName = segment.subway_line?.replace(/^수도권/, '').replace(/_\d+$/, '');
                backgroundColor = subwayLineColors[lineName] || '#34A853';
                labelText = lineName || '지하철';
                
                // 디버깅: 지하철 노선 매핑 확인
                console.log('🚇 지하철 노선 디버깅:', {
                    originalLine: segment.subway_line,
                    processedLine: lineName,
                    hasColor: !!subwayLineColors[lineName],
                    color: backgroundColor,
                    availableKeys: Object.keys(subwayLineColors)
                });
            } else if (segment.mode === 'WALK') {
                backgroundColor = '#F0F0F0';
                labelText = '도보';
            }

            return {
                ...segment,
                segmentTime,
                widthPercent,
                backgroundColor,
                labelText
            };
        });

        return (
            <>
                <TransitSegmentsContainer>
                    {/* 시간 막대 */}
                    <SegmentBar>
                        {segmentData.map((segment, index) => {
                            // 현재 segment 이전의 모든 segment width 합계 (왼쪽에서 차지된 공간)
                            const leftOccupiedWidth = segmentData
                                .slice(0, index)
                                .reduce((sum, seg) => sum + seg.widthPercent, 0);
                            
                            // 현재 segment 이후의 모든 segment width 합계 (오른쪽에서 차지할 공간)
                            const rightOccupiedWidth = segmentData
                                .slice(index + 1)
                                .reduce((sum, seg) => sum + seg.widthPercent, 0);
                            
                            // 현재 segment가 차지할 width (전체에서 오른쪽 공간 제외)
                            const currentWidth = 100 - rightOccupiedWidth;
                            
                            // 노출되는 부분의 너비 (현재 segment에서 왼쪽 가려진 부분 제외)
                            const visibleWidth = segment.widthPercent;
                                
                            return (
                                <SegmentPart
                                    key={index}
                                    style={{
                                        width: `${currentWidth}%`,
                                        backgroundColor: segment.backgroundColor,
                                        position: 'absolute',
                                        left: '0',
                                        zIndex: segmentData.length - index // 첫 번째가 가장 아래에
                                    }}
                                    title={
                                    segment.mode === 'BUS'
                                        ? `버스 ${segment.bus_number}: ${segment.section_time || '0분'} (${segment.start_stop} → ${segment.end_stop})`
                                        : segment.mode === 'SUBWAY'
                                            ? `지하철 ${segment.subway_line || ''}: ${segment.section_time || '0분'} (${segment.start_station} → ${segment.end_station})`
                                            : `도보: ${segment.section_time || '0분'}`
                                }
                                >
                                    <div style={{
                                        position: 'absolute',
                                        left: `${(leftOccupiedWidth / currentWidth) * 100}%`,
                                        width: `${(visibleWidth / currentWidth) * 100}%`,
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        pointerEvents: 'none'
                                    }}>
                                        {segment.segmentTime}분
                                    </div>
                                </SegmentPart>
                            );
                        })}
                    </SegmentBar>

                    {/* 수단 라벨 */}
                    <SegmentLabels>
                        {segmentData.map((segment, index) => (
                            <SegmentLabel
                                key={index}
                                style={{
                                    width: `${segment.widthPercent}%`,
                                    color: '#2A2A2A',
                                }}
                            >
                                {segment.labelText}
                            </SegmentLabel>
                        ))}
                    </SegmentLabels>
                </TransitSegmentsContainer>
                
                {/* 자세히 보기 버튼 - 경로 안내 바 바로 아래 */}
                <DetailToggleButton 
                    $isExpanded={isDetailExpanded}
                    onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                >
                    자세히 보기
                </DetailToggleButton>
                
                {/* 세부 대중교통 정보 */}
                {renderTransitDetails(segments)}
            </>
        );
    };

    // 루트가 없으면 기본 메시지 표시
    if (routes.length === 0) {
        return (
            <Container>
                <RouteBoxContainer 
                    $isTransit={selectedTransport === 'transit'} 
                    $isExpanded={false}
                >
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
        <Container 
            $isTransit={selectedTransport === 'transit'} 
            $isExpanded={isDetailExpanded}
        >
            <NavigationButton
                className="left"
                onClick={goToPreviousRoute}
                disabled={currentRouteIndex === 0}
            >
                <img src={goLeft} alt="이전 루트" />
            </NavigationButton>

            <RouteBoxContainer 
                $isTransit={selectedTransport === 'transit'} 
                $isExpanded={isDetailExpanded}
            >
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
                        ) : selectedTransport === 'walk' && routeData?.data ? (
                            <>
                                <Time><p>{routeData.data.walk_time?.replace('분', '') || '12'}</p>분</Time>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Distance>{routeData.data.walk_distance || '1.1km'}</Distance>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Steps>{routeData.data.walk_step || '3,600걸음'}</Steps>
                            </>
                        ) : selectedTransport === 'car' && routeInfo ? (
                            <>
                                <Time><p>{routeInfo.duration}</p>분</Time>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Distance>{routeInfo.distance}km</Distance>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Steps>{routeInfo.taxiFare?.toLocaleString()}원</Steps>
                            </>
                        ) : selectedTransport === 'transit' && (routeInfo || routeData?.transit_summary) ? (
                            (() => {
                                const summary = routeData?.transit_summary || {};
                                
                                
                                // routeData.transit_summary를 우선으로 사용 (정확한 API 데이터)
                                const time = summary.trans_time?.replace('분', '') || routeInfo?.duration || '0';
                                const distance = summary.trans_distance || routeInfo?.distance + 'km' || '0km';
                                const fare = summary.trans_fare || routeInfo?.taxiFare?.toLocaleString() + '원' || '0원';
                                

                                return (
                                    <>
                                        <Time><p>{time}</p>분</Time>
                                        <p style={{ fontWeight: '500' }}>|</p>
                                        <Distance>{distance}</Distance>
                                        <p style={{ fontWeight: '500' }}>|</p>
                                        <Steps>{fare}</Steps>
                                    </>
                                );
                            })()
                        ) : selectedTransport === 'car' && routeData?.car_routes?.[0] ? (
                            <>
                                <Time><p>{routeData.car_routes[0].car_duration.replace('분', '')}</p>분</Time>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Distance>{routeData.car_routes[0].distance}</Distance>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Steps>{routeData.car_routes[0].taxi_fare}</Steps>
                            </>
                        ) : (
                            <>
                                <Time><p>12</p>분</Time>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Distance>1.1km</Distance>
                                <p style={{ fontWeight: '500' }}>|</p>
                                <Steps>3,600걸음</Steps>
                            </>
                        )}
                    </InfoBox>
                </RouteInfo>

                {/* 대중교통 모드일 때 구간 정보 표시 */}
                {(() => {
                    console.log('🚌 대중교통 구간 렌더링 조건 확인:', {
                        selectedTransport,
                        isTransit: selectedTransport === 'transit',
                        routeInfo,
                        hasSegments: !!routeInfo?.segments,
                        segments: routeInfo?.segments,
                        segmentsLength: routeInfo?.segments?.length,
                        routeData,
                        routeDataSegments: routeData?.segments,
                        routeDataTransitSummary: routeData?.transit_summary
                    });

                    // routeInfo에서 segments가 없으면 routeData에서 직접 가져오기
                    const segments = routeInfo?.segments || routeData?.segments;

                    if (selectedTransport === 'transit' && segments) {
                        console.log('✅ 대중교통 구간 렌더링 시작', { segments });
                        return renderTransitSegments(segments);
                    }
                    return null;
                })()}
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