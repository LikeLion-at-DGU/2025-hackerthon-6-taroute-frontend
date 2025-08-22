import styled from "styled-components";
import RouteBox from "../components/Spot/RouteBox.jsx";
import SpotWhiteBox from "../components/Spot/SpotWhitebox";
import PageNavbar from "../components/common/PageNavbar.jsx";
import SpotMap from "../components/Spot/SpotMap.jsx";
import { useState, useCallback, useMemo } from "react";

const Spotcontainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 100vh;
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
    height: 100vh;
    pointer-events: none;
    
    & > * {
        pointer-events: auto;
    }
`;

const Spot = () => {
    const [currentRoute, setCurrentRoute] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);

    // 콜백 함수들을 최적화
    const handleRouteChange = useCallback((route) => {
        setCurrentRoute(route);
    }, []);

    const handleRouteInfoChange = useCallback((info) => {
        setRouteInfo(info);
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
                    height={window.innerHeight || 800}
                    start={startCoords}
                    end={endCoords}
                    startIndex={currentRoute?.originIndex || 1}
                    endIndex={currentRoute?.destinationIndex || 2}
                    onRouteInfoChange={handleRouteInfoChange}
                />
            </MapBackground>
            
            {/* 상단에 표시될 컨텐츠들 */}
            <ContentOverlay>
                <PageNavbar title="일정계획" />
                <div style={{ flex: 1 }} /> {/* 공간 확보용 */}
                <RouteBox onRouteChange={handleRouteChange} routeInfo={routeInfo} />
                <SpotWhiteBox />
            </ContentOverlay>
        </Spotcontainer>
    );
};

export default Spot;