import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

/**
 * SpotMap: 카카오맵을 사용한 지도 컴포넌트
 */
const SpotMap = ({
	start = { lat: 37.566567545861645, lng: 126.9850380932383 },
	end = { lat: 37.403049076341794, lng: 127.10331814639885 },
	height = 300,
	startIndex = 1,
	endIndex = 2,
	onRouteInfoChange
}) => {
	const mapRef = useRef(null)
	const mapObjRef = useRef(null)
	const [ready, setReady] = useState(false)
	const [routeData, setRouteData] = useState(null)
	const [loading, setLoading] = useState(false)

	// 카카오맵 SDK 로드 확인
	useEffect(() => {
		const checkKakaoReady = () => {
			if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
				setReady(true)
				return true
			}
			return false
		}

		if (checkKakaoReady()) return

		// SDK 로드
		if (!document.querySelector('script[src*="dapi.kakao.com/v2/maps"]')) {
			const script = document.createElement('script')
			script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_APP_KEY}&autoload=false`
			script.onload = () => {
				window.kakao.maps.load(() => {
					setReady(true)
				})
			}
			document.head.appendChild(script)
		}
	}, [])

	// 지도 초기화
	useEffect(() => {
		if (!ready || !mapRef.current) return

		initKakaoMap()

		return () => {
			mapObjRef.current = null
		}
	}, [ready, start?.lat, start?.lng, end?.lat, end?.lng, height])

	// 카카오맵 초기화 함수
	const initKakaoMap = () => {
		try {
			// 기본 좌표 (서울) 또는 전달받은 좌표 사용
			const defaultStart = { lat: 37.566567545861645, lng: 126.9850380932383 }
			const defaultEnd = { lat: 37.403049076341794, lng: 127.10331814639885 }
			
			const startCoords = start || defaultStart
			const endCoords = end || defaultEnd

			// 지도 중심점 계산
			const centerLat = (startCoords.lat + endCoords.lat) / 2
			const centerLng = (startCoords.lng + endCoords.lng) / 2

			// 지도 옵션
			const mapOptions = {
				center: new window.kakao.maps.LatLng(centerLat, centerLng),
				level: 8 // 지도 확대 레벨
			}

			// 지도 생성
			const map = new window.kakao.maps.Map(mapRef.current, mapOptions)
			mapObjRef.current = map

			// 길찾기 실행
			findRoute(map, startCoords, endCoords)

			console.log('✅ 카카오맵 생성 완료!')
			console.log('📍 출발지:', startCoords)
			console.log('📍 도착지:', endCoords)
			
		} catch (error) {
			console.error('❌ 카카오맵 생성 실패:', error)
		}
	}

	// 카카오 내비게이션 API 길찾기
	const findRoute = async (map, startCoords, endCoords) => {
		setLoading(true)
		try {
			console.log('🚗 길찾기 요청 시작')
			
			const params = new URLSearchParams({
				origin: `${startCoords.lng},${startCoords.lat}`,
				destination: `${endCoords.lng},${endCoords.lat}`,
				priority: 'RECOMMEND',
				car_fuel: 'GASOLINE',
				car_hipass: 'false',
				alternatives: 'false',
				road_details: 'true'
			})

			const response = await axios.get(`https://apis-navi.kakaomobility.com/v1/directions?${params}`, {
				headers: {
					'Authorization': `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
					'Content-Type': 'application/json'
				}
			})

			console.log('✅ 길찾기 응답:', response.data)

			if (response.data.routes && response.data.routes[0]) {
				const route = response.data.routes[0]
				setRouteData(route)
				drawRoute(map, route, startCoords, endCoords)
				
				// 상위 컴포넌트에 경로 정보 전달
				if (onRouteInfoChange && route.summary) {
					onRouteInfoChange({
						distance: (route.summary.distance / 1000).toFixed(1), // km
						duration: Math.round(route.summary.duration / 60), // 분
						taxiFare: route.summary.fare?.taxi || 0
					})
				}
			}

		} catch (error) {
			console.error('❌ 길찾기 실패:', error)
			console.error('에러 상세:', {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data
			})
			// 실패시 경로 정보 초기화
			if (onRouteInfoChange) {
				onRouteInfoChange(null)
			}
		} finally {
			setLoading(false)
		}
	}

	// 경로 그리기
	const drawRoute = (map, route, startCoords, endCoords) => {
		try {
			// 기존 마커와 경로 제거
			// (실제로는 마커와 폴리라인을 상태로 관리해야 하지만, 단순화)

			// RouteListItem과 같은 색상 배열 사용
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

			// 출발지와 도착지 색상 가져오기
			const startColor = colors[(startIndex - 1) % 10] || '#e06d6d';
			const endColor = colors[(endIndex - 1) % 10] || '#e09b6d';

			// 출발지 동그라미 마커
			const startCircle = new window.kakao.maps.Circle({
				center: new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
				radius: 50, // 반지름 (미터)
				strokeWeight: 3,
				strokeColor: startColor,
				strokeOpacity: 1,
				fillColor: startColor,
				fillOpacity: 0.8
			});
			startCircle.setMap(map);

			// 도착지 동그라미 마커
			const endCircle = new window.kakao.maps.Circle({
				center: new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng),
				radius: 50, // 반지름 (미터)
				strokeWeight: 3,
				strokeColor: endColor,
				strokeOpacity: 1,
				fillColor: endColor,
				fillOpacity: 0.8
			});
			endCircle.setMap(map);

			// 모든 섹션의 경로 좌표 수집
			const allPaths = []
			route.sections.forEach(section => {
				section.roads.forEach(road => {
					const vertices = road.vertexes
					for (let i = 0; i < vertices.length; i += 2) {
						const lng = vertices[i]
						const lat = vertices[i + 1]
						if (lng && lat) {
							allPaths.push(new window.kakao.maps.LatLng(lat, lng))
						}
					}
				})
			})

			// 경로선 그리기 (출발지에서 도착지까지 그라디언트)
			if (allPaths.length > 0) {
				// HEX를 RGB로 변환하는 함수
				const hexToRgb = (hex) => {
					const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
					return result ? {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16)
					} : null;
				};

				// 출발지와 도착지 색상을 RGB로 변환
				const startRgb = hexToRgb(startColor);
				const endRgb = hexToRgb(endColor);

				// 색상 보간 함수
				const interpolateColor = (ratio) => {
					const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
					const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
					const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);
					
					return `rgb(${r}, ${g}, ${b})`;
				};

				const segments = 15; // 그라디언트 구간 수 (부드러운 효과)
				const segmentSize = Math.max(1, Math.floor(allPaths.length / segments));
				
				for (let i = 0; i < segments && i * segmentSize < allPaths.length - 1; i++) {
					const segStartIndex = i * segmentSize;
					const segEndIndex = Math.min((i + 1) * segmentSize + 1, allPaths.length);
					const segmentPaths = allPaths.slice(segStartIndex, segEndIndex);
					
					if (segmentPaths.length > 1) {
						const ratio = i / (segments - 1); // 0에서 1까지
						const polyline = new window.kakao.maps.Polyline({
							path: segmentPaths,
							strokeWeight: 6,
							strokeColor: interpolateColor(ratio),
							strokeOpacity: 0.8,
							strokeStyle: 'solid'
						});
						polyline.setMap(map);
					}
				}

				// 지도 범위를 경로에 맞게 조정
				const bounds = new window.kakao.maps.LatLngBounds()
				allPaths.forEach(point => bounds.extend(point))
				map.setBounds(bounds)
			}

		} catch (error) {
			console.error('❌ 경로 그리기 실패:', error)
		}
	}

	return (
		<MapContainer>
			<div 
				ref={mapRef} 
				style={{ 
					width: '100%', 
					height: `${height}px`, 
					backgroundColor: ready ? 'transparent' : '#f5f5f5'
				}} 
			/>
			{!ready && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					fontSize: 14,
					color: '#666'
				}}>
					지도 로딩 중...
				</div>
			)}
			{loading && ready && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					padding: '10px 20px',
					background: 'rgba(0,0,0,0.8)',
					color: 'white',
					borderRadius: 8,
					fontSize: 14,
					fontWeight: 'bold'
				}}>
					🚗 길찾기 중...
				</div>
			)}
		</MapContainer>
	)
}

export default SpotMap
