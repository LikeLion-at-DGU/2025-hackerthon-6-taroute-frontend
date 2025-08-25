import styled from "styled-components";
import RouteBox from "../components/Spot/RouteBox.jsx";
import SpotWhiteBox from "../components/Spot/SpotWhitebox";
import PageNavbar from "../components/common/PageNavbar.jsx";
import SpotMap from "../components/Spot/SpotMap.jsx";
import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";


const Spotcontainer = styled.div`
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
    height: 812px;
    pointer-events: none;
    
    & > * {
        pointer-events: auto;
    }
`;

const Spot = () => {
    const { t } = useTranslation();
    const [currentRoute, setCurrentRoute] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [selectedTransport, setSelectedTransport] = useState('walk'); // 교통수단 상태 추가

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

    return (
        <Spotcontainer>
            {/* 배경 지도 */}
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
            
            {/* 상단에 표시될 컨텐츠들 */}
            <ContentOverlay>
                <PageNavbar title={t("spot.title")} />
                <div style={{ flex: 1 }} /> {/* 공간 확보용 */}
                <RouteBox 
                    onRouteChange={handleRouteChange} 
                    routeInfo={routeInfo} 
                    onTransportChange={handleTransportChange}
                />
                <SpotWhiteBox />
            </ContentOverlay>
        </Spotcontainer>
    );
};

export default Spot;