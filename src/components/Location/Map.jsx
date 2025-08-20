/* src/components/Location/Map.jsx */
import { useEffect, useRef, useState } from "react";

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

export default function Map({ 
    keyword = "", 
    currentLocation = null,  // { lat, lng }
    centerLocation = null,   // { lat, lng }
    markerPosition = null,   // { lat, lng } - 드래그 가능한 마커 위치
    onMarkerDragEnd = null,  // 마커 드래그 완료 콜백
    isDraggable = false      // 마커 드래그 가능 여부
}) {
    const mapEl = useRef(null);
    const mapRef = useRef(null);
    const infoRef = useRef(null);
    const markersRef = useRef([]);
    const draggableMarkerRef = useRef(null); // 드래그 가능한 마커
    const [sdkLoaded, setSdkLoaded] = useState(!!(window.kakao && window.kakao.maps));

    // 0) Kakao SDK 동적 로드 (env의 APP KEY 사용)
    useEffect(() => {
        if (sdkLoaded) return;

        if (!KAKAO_APP_KEY) {
            console.error("[KakaoMap] VITE_KAKAO_MAP_APP_KEY 가 .env 에 설정되어 있지 않습니다.");
            return;
        }

        const existing = document.getElementById("kakao-map-sdk");
        if (existing) {
            // 이미 스크립트가 있으면 로드 완료 여부만 확인
            if (window.kakao?.maps) setSdkLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.id = "kakao-map-sdk";
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
        script.onload = () => {
            // autoload=false 이므로 load 콜백에서 초기화 가능
            window.kakao.maps.load(() => setSdkLoaded(true));
        };
        document.head.appendChild(script);
    }, [sdkLoaded]);

    // 1) 지도 1회 초기화 및 현재 위치/중심 좌표 처리
    useEffect(() => {
        if (!sdkLoaded || !mapEl.current || mapRef.current) return;
        const { kakao } = window;

        // 중심 좌표 결정 (우선순위: centerLocation > markerPosition > currentLocation > 기본값)
        let center;
        if (centerLocation) {
            center = new kakao.maps.LatLng(centerLocation.lat, centerLocation.lng);
        } else if (markerPosition) {
            center = new kakao.maps.LatLng(markerPosition.lat, markerPosition.lng);
        } else if (currentLocation) {
            center = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        } else {
            center = new kakao.maps.LatLng(37.566826, 126.9786567); // 기본값 (서울시청)
        }

        const map = new kakao.maps.Map(mapEl.current, { center, level: 3 });
        mapRef.current = map;
        infoRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });

        return () => {
            // 언마운트 시 마커 정리
            markersRef.current.forEach((m) => m.setMap(null));
            markersRef.current = [];
            mapRef.current = null;
            infoRef.current = null;
        };
    }, [sdkLoaded, centerLocation, markerPosition, currentLocation]);

    // 2) 현재 위치 마커 표시 (드래그 가능한 마커가 없을 때만)
    useEffect(() => {
        const { kakao } = window;
        const map = mapRef.current;
        if (!sdkLoaded || !kakao?.maps || !map || !currentLocation) return;
        
        // 드래그 가능한 마커가 있으면 현재 위치 마커는 표시하지 않음
        if (isDraggable && markerPosition) return;

        // 이전 마커들 제거
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        // 현재 위치 마커 생성
        const position = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        
        // 현재 위치 마커 생성 (빨간색 SVG 마커)
        const currentMarkerImageSrc = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" fill="#EA4335"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
        `);
        
        const currentMarkerImage = new kakao.maps.MarkerImage(
            currentMarkerImageSrc,
            new kakao.maps.Size(32, 40),
            { offset: new kakao.maps.Point(16, 40) }
        );
        
        const currentMarker = new kakao.maps.Marker({
            position: position,
            map: map,
            image: currentMarkerImage
        });
        
        markersRef.current.push(currentMarker);

        // 현재 위치에 정보창 표시
        kakao.maps.event.addListener(currentMarker, 'click', () => {
            infoRef.current.setContent(
                '<div style="padding:5px;font-size:12px;">📍 현재 위치</div>'
            );
            infoRef.current.open(map, currentMarker);
        });

        // 지도 중심을 현재 위치로 이동
        map.setCenter(position);
    }, [sdkLoaded, currentLocation, isDraggable, markerPosition]);

    // 3) 키워드 검색 - LocationMap에서는 비활성화
    useEffect(() => {
        // LocationMap에서는 키워드 검색을 사용하지 않음
        // 대신 markerPosition으로 정확한 위치의 드래그 가능한 마커만 표시
        return;
    }, [sdkLoaded, keyword]);

    // 4) 드래그 가능한 마커 처리
    useEffect(() => {
        const { kakao } = window;
        const map = mapRef.current;
        if (!sdkLoaded || !kakao?.maps || !map || !markerPosition || !isDraggable) return;

        // 기존 마커들 제거 (검색 마커들 제외하고 드래그 마커만)
        if (draggableMarkerRef.current) {
            draggableMarkerRef.current.setMap(null);
        }

        // 드래그 가능한 마커 생성
        const position = new kakao.maps.LatLng(markerPosition.lat, markerPosition.lng);
        
        // SVG 기반 커스텀 마커 이미지 생성
        const markerImageSrc = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" fill="#4285F4"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
        `);
        
        const markerImage = new kakao.maps.MarkerImage(
            markerImageSrc,
            new kakao.maps.Size(32, 40),
            { offset: new kakao.maps.Point(16, 40) }
        );
        
        // 기본 마커 이미지 사용 (이미지 깨짐 방지)
        const draggableMarker = new kakao.maps.Marker({
            position: position,
            map: map,
            draggable: true, // 드래그 가능
            image: markerImage
        });

        draggableMarkerRef.current = draggableMarker;

        // 마커 드래그 이벤트 리스너
        kakao.maps.event.addListener(draggableMarker, 'dragend', () => {
            const position = draggableMarker.getPosition();
            const newPosition = {
                lat: position.getLat(),
                lng: position.getLng()
            };
            
            if (onMarkerDragEnd) {
                onMarkerDragEnd(newPosition);
            }
        });

        // 마커 클릭 시 정보창
        kakao.maps.event.addListener(draggableMarker, 'click', () => {
            infoRef.current.setContent(
                '<div style="padding:5px;font-size:12px;">📍 드래그해서 위치를 변경하세요</div>'
            );
            infoRef.current.open(map, draggableMarker);
        });

        return () => {
            if (draggableMarkerRef.current) {
                draggableMarkerRef.current.setMap(null);
                draggableMarkerRef.current = null;
            }
        };
    }, [sdkLoaded, markerPosition, isDraggable, onMarkerDragEnd]);

    // 5) 지도 클릭으로 마커 위치 이동 지원 (드래그가 어려운 환경 대비)
    useEffect(() => {
        const { kakao } = window;
        const map = mapRef.current;
        if (!sdkLoaded || !kakao?.maps || !map || !isDraggable) return;

        const handleClick = (e) => {
            const latlng = e.latLng;
            const newPos = { lat: latlng.getLat(), lng: latlng.getLng() };
            if (draggableMarkerRef.current) {
                draggableMarkerRef.current.setPosition(latlng);
            }
            if (onMarkerDragEnd) onMarkerDragEnd(newPos);
        };

        kakao.maps.event.addListener(map, 'click', handleClick);
        return () => kakao.maps.event.removeListener(map, 'click', handleClick);
    }, [sdkLoaded, isDraggable, onMarkerDragEnd]);

    // 5) 지도 클릭으로 마커 위치 이동 지원 (모바일에서 드래그가 어려운 경우 대비)
    useEffect(() => {
        const { kakao } = window;
        const map = mapRef.current;
        if (!sdkLoaded || !kakao?.maps || !map || !isDraggable) return;

        const handleClick = (e) => {
            const latlng = e.latLng;
            const newPos = { lat: latlng.getLat(), lng: latlng.getLng() };
            if (draggableMarkerRef.current) {
                draggableMarkerRef.current.setPosition(latlng);
            }
            if (onMarkerDragEnd) onMarkerDragEnd(newPos);
        };

        kakao.maps.event.addListener(map, 'click', handleClick);
        return () => kakao.maps.event.removeListener(map, 'click', handleClick);
    }, [sdkLoaded, isDraggable, onMarkerDragEnd]);

    // 부모가 height를 지정해줘야 보입니다
    return <div ref={mapEl} style={{ width: "100%", height: "100%" }} />;
}  