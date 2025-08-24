import styled from "styled-components";
import SpotMap from "../components/Spot/SpotMap";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import RouteBox from "../components/Spot/RouteBox.jsx";
import { getSharedRoute } from "../apis/shareApi";

const ShareSpotContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 812px;
    max-height: 812px;
    overflow: hidden;
`;

const MapBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
`;

const ContentOverlay = styled.div`
    position: relative;
    z-index: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    height: 812px;
    pointer-events: none;
    margin-bottom: 60px;
    & > * {
        pointer-events: auto;
    }
`;



const ShareSpot = () => {
    const { shareId } = useParams();
    const [currentRoute, setCurrentRoute] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [selectedTransport, setSelectedTransport] = useState('walk');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
        // 콜백 함수들을 최적화
        const handleRouteChange = useCallback((route) => {
            setCurrentRoute(route);
        }, []);
    
        const handleRouteInfoChange = useCallback((info) => {
            setRouteInfo(info);
        }, []);
    
        // 교통수단 변경 핸들러 추가
        const handleTransportChange = useCallback((transport) => {
            setSelectedTransport(transport);
        }, []);
    
        // 공유된 경로 데이터 로드
        useEffect(() => {
            if (shareId) {
                loadSharedRoute();
            }
        }, [shareId]);
    
        const loadSharedRoute = async () => {
            if (!shareId) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const sharedData = await getSharedRoute(shareId);
                
                // 공유 데이터를 currentRoute 형식으로 변환
                if (sharedData?.params) {
                    const { start, end } = sharedData.params;
                    setCurrentRoute({
                        origin: {
                            name: start?.name || '출발지',
                            lat: start?.lat,
                            lng: start?.lng,
                            latitude: start?.lat,
                            longitude: start?.lng
                        },
                        destination: {
                            name: end?.name || '도착지',
                            lat: end?.lat,
                            lng: end?.lng,
                            latitude: end?.lat,
                            longitude: end?.lng
                        },
                        originIndex: 1,
                        destinationIndex: 2
                    });
                }
            } catch (err) {
                console.error('공유 경로 로드 실패:', err);
                setError('공유된 경로를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };
    
        // start와 end 좌표를 useMemo로 최적화하여 무한 렌더링 방지
        const startCoords = useMemo(() => {
            if (!currentRoute?.origin) return undefined;
            const origin = currentRoute.origin;
            const lat = origin.location?.latitude || origin.latitude || origin.y || origin.lat;
            const lng = origin.location?.longitude || origin.longitude || origin.x || origin.lng || origin.long;
            return lat && lng ? { lat, lng } : undefined;
        }, [
            currentRoute?.origin?.location?.latitude,
            currentRoute?.origin?.latitude,
            currentRoute?.origin?.y,
            currentRoute?.origin?.lat,
            currentRoute?.origin?.location?.longitude,
            currentRoute?.origin?.longitude,
            currentRoute?.origin?.x,
            currentRoute?.origin?.lng,
            currentRoute?.origin?.long
        ]);
    
        const endCoords = useMemo(() => {
            if (!currentRoute?.destination) return undefined;
            const destination = currentRoute.destination;
            const lat = destination.location?.latitude || destination.latitude || destination.y || destination.lat;
            const lng = destination.location?.longitude || destination.longitude || destination.x || destination.lng || destination.long;
            return lat && lng ? { lat, lng } : undefined;
        }, [
            currentRoute?.destination?.location?.latitude,
            currentRoute?.destination?.latitude,
            currentRoute?.destination?.y,
            currentRoute?.destination?.lat,
            currentRoute?.destination?.location?.longitude,
            currentRoute?.destination?.longitude,
            currentRoute?.destination?.x,
            currentRoute?.destination?.lng,
            currentRoute?.destination?.long
        ]);


    if (loading) {
        return (
            <ShareSpotContainer>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    fontSize: '16px',
                    color: '#666'
                }}>
                    공유된 경로를 불러오는 중...
                </div>
            </ShareSpotContainer>
        );
    }

    if (error) {
        return (
            <ShareSpotContainer>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    fontSize: '16px',
                    color: '#dc3545',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    {error}
                </div>
            </ShareSpotContainer>
        );
    }

    return(
        <ShareSpotContainer>
            <MapBackground>
                <SpotMap 
                    height={812}
                    start={startCoords}
                    end={endCoords}
                    startIndex={currentRoute?.originIndex || 1}
                    endIndex={currentRoute?.destinationIndex || 2}
                    transportMode={selectedTransport}
                    onRouteInfoChange={handleRouteInfoChange}
                    startName={currentRoute?.origin?.name || currentRoute?.origin?.place_name || '출발지'}
                    endName={currentRoute?.destination?.name || currentRoute?.destination?.place_name || '도착지'}
                />
            </MapBackground>

            <ContentOverlay>
                <RouteBox 
                    onRouteChange={handleRouteChange} 
                    routeInfo={routeInfo} 
                    onTransportChange={handleTransportChange}
                    isSharedMode={!!shareId}
                />
            </ContentOverlay>
        </ShareSpotContainer>
    );
}

export default ShareSpot;