import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { getRouteInfo } from '../../apis/routeApi'

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    /* 네온 효과를 위한 글로벌 스타일 */
    .neon-polyline {
        filter: drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor);
    }
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
	transportMode = 'car', // 교통수단 ('car', 'walk', 'transit')
	onRouteInfoChange,
	startName = '출발지',
	endName = '도착지'
}) => {
	const mapRef = useRef(null)
	const mapObjRef = useRef(null)
	const [ready, setReady] = useState(false)
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
	}, [ready, start?.lat, start?.lng, end?.lat, end?.lng, height, transportMode])

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
			if (transportMode === 'walk') {
				findWalkingRoute(map, startCoords, endCoords)
			} else if (transportMode === 'transit') {
				findTransitRoute(map, startCoords, endCoords)
			} else {
				findRoute(map, startCoords, endCoords)
			}

			console.log('✅ 카카오맵 생성 완료!')
			console.log('📍 출발지:', startCoords)
			console.log('📍 도착지:', endCoords)
			
		} catch (error) {
			console.error('❌ 카카오맵 생성 실패:', error)
		}
	}

	// TMAP 도보 길찾기 API 호출
	const findWalkingRoute = async (map, startCoords, endCoords) => {
		setLoading(true)
		try {
			console.log('🚶 도보 경로 API 호출 시작')

			// RouteAPI 호출
			const routeResponse = await getRouteInfo({
				origin_x: startCoords.lng,
				origin_y: startCoords.lat,
				destination_x: endCoords.lng,
				destination_y: endCoords.lat,
				transport: 'walk',
				startName,
				endName
			})

			console.log('✅ 도보 경로 API 응답:', routeResponse)
			console.log('🔍 points 배열 확인:', routeResponse?.data?.points)
			if (routeResponse?.data?.points) {
				console.log('📍 첫 번째 point:', routeResponse.data.points[0])
				console.log('📍 마지막 point:', routeResponse.data.points[routeResponse.data.points.length - 1])
			}

			// 상위 컴포넌트에 경로 정보 전달
			if (onRouteInfoChange && routeResponse?.data) {
				// walk_time에서 숫자만 추출 (예: "35분" -> 35)
				const timeMatch = routeResponse.data.walk_time?.match(/\d+/);
				const duration = timeMatch ? parseInt(timeMatch[0]) : 0;
				
				// walk_distance에서 숫자만 추출 (예: "2.6km" -> 2.6)
				const distanceMatch = routeResponse.data.walk_distance?.match(/([\d.]+)/);
				const distance = distanceMatch ? parseFloat(distanceMatch[1]) : 0;

				onRouteInfoChange({
					distance: distance, // km
					duration: duration, // 분
					taxiFare: 0 // 도보는 택시비 없음
				})
			}

			// 도보 경로 그리기 (API 응답의 points 사용)
			drawWalkingRoute(map, routeResponse?.data?.points, startCoords, endCoords)

		} catch (error) {
			console.error('❌ 도보 경로 API 호출 실패:', error)
			
			// API 실패 시 직선 거리로 폴백
			const distance = calculateDistance(startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng)
			const walkingSpeed = 5 // 시속 5km
			const walkingTime = Math.round((distance / walkingSpeed) * 60) // 분

			if (onRouteInfoChange) {
				onRouteInfoChange({
					distance: distance.toFixed(1), // km
					duration: walkingTime, // 분
					taxiFare: 0 // 도보는 택시비 없음
				})
			}

			// 직선 경로로 그리기
			drawWalkingRoute(map, null, startCoords, endCoords)
		} finally {
			setLoading(false)
		}
	}

	// 대중교통 길찾기 API 호출
	const findTransitRoute = async (map, startCoords, endCoords) => {
		setLoading(true)
		try {
			console.log('🚌 대중교통 경로 API 호출 시작')

			// RouteAPI 호출
			const routeResponse = await getRouteInfo({
				origin_x: startCoords.lng,
				origin_y: startCoords.lat,
				destination_x: endCoords.lng,
				destination_y: endCoords.lat,
				transport: 'transit',
				startName,
				endName
			})

			console.log('✅ 대중교통 경로 API 응답:', routeResponse)

			// 상위 컴포넌트에 경로 정보 전달 (segments 정보도 포함)
			if (onRouteInfoChange && routeResponse?.data) {
				const summary = routeResponse.data.transit_summary || {};
				
				// 시간, 거리, 요금에서 숫자만 추출
				const timeMatch = summary.trans_time?.match(/\d+/);
				const duration = timeMatch ? parseInt(timeMatch[0]) : 0;
				
				const distanceMatch = summary.trans_distance?.match(/([\d.]+)/);
				const distance = distanceMatch ? parseFloat(distanceMatch[1]) : 0;
				
				const fareMatch = summary.trans_fare?.match(/[\d,]+/);
				const fare = fareMatch ? parseInt(fareMatch[0].replace(/,/g, '')) : 0;

				onRouteInfoChange({
					distance: distance, // km
					duration: duration, // 분
					taxiFare: fare, // 대중교통 요금
					segments: routeResponse.data.segments || [] // 구간 정보
				})
			}

			// 대중교통 경로 그리기 (API 응답 구조에 따라 segments 위치 다름)
			const segments = routeResponse?.data?.segments || routeResponse?.segments;
			console.log('🚌 segments 전달 확인:', {
				'routeResponse?.data?.segments': routeResponse?.data?.segments,
				'routeResponse?.segments': routeResponse?.segments,
				'최종 segments': segments
			});
			drawTransitRoute(map, segments, startCoords, endCoords)

		} catch (error) {
			console.error('❌ 대중교통 경로 API 호출 실패:', error)
			
			// API 실패 시 직선 거리로 폴백
			const distance = calculateDistance(startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng)
			const estimatedTime = Math.round(distance * 3) // 대략적인 대중교통 시간 (km당 3분)

			if (onRouteInfoChange) {
				onRouteInfoChange({
					distance: distance.toFixed(1), // km
					duration: estimatedTime, // 분
					taxiFare: 0
				})
			}

			// 직선 경로로 그리기
			drawTransitRoute(map, null, startCoords, endCoords)
		} finally {
			setLoading(false)
		}
	}

	// 깔끔한 네온 마커 생성 (이미지 스타일 참고)
	const createNeonMarker = (position, color, text, index) => {
		// 마커 생성
		const markerElement = document.createElement('div');
		markerElement.style.cssText = `
			width: 32px;
			height: 32px;
			background: ${color};
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			color: white;
			font-size: 14px;
			cursor: pointer;
			box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px ${color}40;
			transition: all 0.2s ease;
			z-index: 10;
			position: relative;
		`;
		markerElement.textContent = index;
		markerElement.title = text; // 툴팁으로 이름 표시

		// 호버 효과
		markerElement.addEventListener('mouseenter', () => {
			markerElement.style.transform = 'scale(1.15)';
			markerElement.style.boxShadow = `0 4px 15px rgba(0,0,0,0.4), 0 0 0 3px ${color}60, 0 0 20px ${color}80`;
		});

		markerElement.addEventListener('mouseleave', () => {
			markerElement.style.transform = 'scale(1)';
			markerElement.style.boxShadow = `0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px ${color}40`;
		});

		// 커스텀 오버레이로 마커 생성
		const customOverlay = new window.kakao.maps.CustomOverlay({
			position: position,
			content: markerElement,
			yAnchor: 0.5,
			xAnchor: 0.5
		});

		return customOverlay;
	};

	// 간단한 툴팁 말풍선 생성 (InfoWindow 대신 CustomOverlay 사용)
	const createTooltip = (position, text) => {
		const tooltipElement = document.createElement('div');
		tooltipElement.style.cssText = `
			padding: 8px 12px;
			background: white;
			color: #333;
			border-radius: 8px;
			font-size: 13px;
			font-weight: 600;
			box-shadow: 0 2px 12px rgba(0,0,0,0.15);
			border: 1px solid #e0e0e0;
			position: relative;
			min-width: 80px;
			text-align: center;
			white-space: nowrap;
			z-index: 1000;
		`;
		tooltipElement.textContent = text;

		// 화살표 추가
		const arrow = document.createElement('div');
		arrow.style.cssText = `
			position: absolute;
			bottom: -6px;
			left: 50%;
			transform: translateX(-50%);
			width: 0;
			height: 0;
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			border-top: 6px solid white;
		`;
		tooltipElement.appendChild(arrow);

		const tooltip = new window.kakao.maps.CustomOverlay({
			position: position,
			content: tooltipElement,
			yAnchor: 1.3,
			xAnchor: 0.5
		});

		return tooltip;
	};
	const calculateDistance = (lat1, lng1, lat2, lng2) => {
		const R = 6371 // 지구 반지름 (km)
		const dLat = (lat2 - lat1) * Math.PI / 180
		const dLng = (lng2 - lng1) * Math.PI / 180
		const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLng/2) * Math.sin(dLng/2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
		return R * c
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

	// TMAP 도보 경로 그리기 (API 응답의 points 사용)
	const drawWalkingRoute = (map, points, startCoords, endCoords) => {
		try {
			// RouteListItem과 같은 색상 배열 사용
			const colors = [
				'#e06d6d', '#e09b6d', '#d9e06d', '#aee06d', '#6de09a',
				'#6ddfe0', '#6d95e0', '#9a6de0', '#e06ddf', '#e06d95'
			];

			const startColor = colors[(startIndex - 1) % 10] || '#e06d6d';
			const endColor = colors[(endIndex - 1) % 10] || '#e09b6d';

			// 네온 효과가 적용된 커스텀 마커 생성
			const startPosition = new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng);
			const endPosition = new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng);

			const startMarker = createNeonMarker(startPosition, startColor, startName || '출발지', startIndex);
			const endMarker = createNeonMarker(endPosition, endColor, endName || '도착지', endIndex);

			startMarker.setMap(map);
			endMarker.setMap(map);

			// 마커 클릭 이벤트 - 툴팁 표시 (도보)
			let startTooltip = null;
			let endTooltip = null;

			// 출발지 마커 클릭 이벤트
			startMarker.getContent().addEventListener('click', () => {
				// 기존 툴팁들 제거
				if (endTooltip) {
					endTooltip.setMap(null);
				}
				if (startTooltip) {
					startTooltip.setMap(null);
					startTooltip = null;
				} else {
					startTooltip = createTooltip(startPosition, startName || '출발지');
					startTooltip.setMap(map);
				}
			});

			// 도착지 마커 클릭 이벤트
			endMarker.getContent().addEventListener('click', () => {
				// 기존 툴팁들 제거
				if (startTooltip) {
					startTooltip.setMap(null);
				}
				if (endTooltip) {
					endTooltip.setMap(null);
					endTooltip = null;
				} else {
					endTooltip = createTooltip(endPosition, endName || '도착지');
					endTooltip.setMap(map);
				}
			});

			// API 응답으로 받은 points가 있으면 실제 경로를 그리고, 없으면 직선으로 그리기
			let routePath = [];
			const bounds = new window.kakao.maps.LatLngBounds();

			if (points && points.length > 0) {
				console.log('🗺️ API 경로 points 사용:', points.length, '개 지점');
				console.log('🔍 points 배열 전체:', points);
				
				// API 응답의 points를 카카오맵 좌표로 변환
				routePath = points.map((point, index) => {
					const lat = point.lat || point.y || point.latitude;
					const lng = point.lng || point.x || point.longitude;
					
					console.log(`📍 Point ${index}:`, { point, lat, lng });
					
					if (!lat || !lng) {
						console.warn(`⚠️ Point ${index}에서 좌표를 찾을 수 없음:`, point);
						return null;
					}
					
					const latlng = new window.kakao.maps.LatLng(lat, lng);
					bounds.extend(latlng);
					return latlng;
				}).filter(Boolean); // null 값 제거
				
				console.log('✅ 변환된 경로 points:', routePath.length, '개');
			} else {
				console.log('🗺️ 직선 경로 사용 - points가 없거나 비어있음');
				console.log('🔍 points 값:', points);
				
				// 직선 경로
				routePath = [
					new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
					new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng)
				];
				bounds.extend(routePath[0]);
				bounds.extend(routePath[1]);
			}

			// HEX를 RGB로 변환하는 함수
			const hexToRgb = (hex) => {
				const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			};

			const startRgb = hexToRgb(startColor);
			const endRgb = hexToRgb(endColor);

			// 경로선을 세그먼트별로 그려서 그라디언트 효과 구현
			const totalSegments = routePath.length - 1;
			
			for (let i = 0; i < totalSegments; i++) {
				const ratio = i / Math.max(totalSegments - 1, 1);
				
				// 색상 보간
				const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
				const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
				const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);
				const currentColor = `rgb(${r}, ${g}, ${b})`;
				
				// 메인 경로선 (굵게, 점선)
				const mainPolyline = new window.kakao.maps.Polyline({
					path: [routePath[i], routePath[i + 1]],
					strokeWeight: 6,
					strokeColor: currentColor,
					strokeOpacity: 1,
					strokeStyle: 'shortdash'
				});
				mainPolyline.setMap(map);
				
				// 네온 글로우 효과를 위한 추가 경로선 (더 굵고 투명)
				const glowPolyline = new window.kakao.maps.Polyline({
					path: [routePath[i], routePath[i + 1]],
					strokeWeight: 12,
					strokeColor: currentColor,
					strokeOpacity: 0.3,
					strokeStyle: 'shortdash'
				});
				glowPolyline.setMap(map);
			}

			// 지도 범위 조정
			map.setBounds(bounds);

		} catch (error) {
			console.error('❌ 도보 경로 그리기 실패:', error)
		}
	}

	// 대중교통 경로 그리기
	const drawTransitRoute = (map, segments, startCoords, endCoords) => {
		try {
			console.log('🎯 drawTransitRoute 호출됨:', {
				segments: segments,
				segmentsCount: segments?.length,
				startCoords,
				endCoords
			});
			// RouteListItem과 같은 색상 배열 사용
			const colors = [
				'#e06d6d', '#e09b6d', '#d9e06d', '#aee06d', '#6de09a',
				'#6ddfe0', '#6d95e0', '#9a6de0', '#e06ddf', '#e06d95'
			];

			const startColor = colors[(startIndex - 1) % 10] || '#e06d6d';
			const endColor = colors[(endIndex - 1) % 10] || '#e09b6d';

			// 출발지와 도착지 마커
			const startPosition = new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng);
			const endPosition = new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng);

			const startMarker = createNeonMarker(startPosition, startColor, startName || '출발지', startIndex);
			const endMarker = createNeonMarker(endPosition, endColor, endName || '도착지', endIndex);

			startMarker.setMap(map);
			endMarker.setMap(map);

			// 마커 클릭 이벤트
			let startTooltip = null;
			let endTooltip = null;

			startMarker.getContent().addEventListener('click', () => {
				if (endTooltip) {
					endTooltip.setMap(null);
				}
				if (startTooltip) {
					startTooltip.setMap(null);
					startTooltip = null;
				} else {
					startTooltip = createTooltip(startPosition, startName || '출발지');
					startTooltip.setMap(map);
				}
			});

			endMarker.getContent().addEventListener('click', () => {
				if (startTooltip) {
					startTooltip.setMap(null);
				}
				if (endTooltip) {
					endTooltip.setMap(null);
					endTooltip = null;
				} else {
					endTooltip = createTooltip(endPosition, endName || '도착지');
					endTooltip.setMap(map);
				}
			});

			const bounds = new window.kakao.maps.LatLngBounds();
			bounds.extend(startPosition);
			bounds.extend(endPosition);

			// segments가 있으면 대중교통 경로를 구간별로 그리기
			if (segments && segments.length > 0) {
				console.log('🚌 대중교통 구간별 경로 그리기:', segments.length, '개 구간');
				console.log('🔍 segments 데이터 상세:', segments);

				// 전체 경로를 위한 좌표 배열
				const allRoutePoints = [];
				
				// BUS/SUBWAY 구간만 필터링
				const transitSegments = segments.filter(segment => segment.mode === 'BUS' || segment.mode === 'SUBWAY');
				console.log('🚌 대중교통 구간만 추출:', transitSegments.length, '개');

				// 첫 번째 교통수단이 있다면 출발지에서 첫 탑승지까지 도보 그리기
				if (transitSegments.length > 0) {
					const firstTransit = transitSegments[0];
					let firstStartPos;
					
					if (firstTransit.mode === 'BUS') {
						firstStartPos = new window.kakao.maps.LatLng(firstTransit.start_blat, firstTransit.start_blon);
					} else if (firstTransit.mode === 'SUBWAY') {
						firstStartPos = new window.kakao.maps.LatLng(firstTransit.start_slat, firstTransit.start_slon);
					}
					
					if (firstStartPos) {
						const walkToFirst = new window.kakao.maps.Polyline({
							path: [startPosition, firstStartPos],
							strokeWeight: 4,
							strokeColor: '#F0F0F0',
							strokeOpacity: 0.8,
							strokeStyle: 'shortdash'
						});
						walkToFirst.setMap(map);
						console.log('🚶 출발지→첫 탑승지 도보 경로 그리기');
					}
				}
				
				// 마지막 교통수단이 있다면 마지막 하차지에서 도착지까지 도보 그리기
				if (transitSegments.length > 0) {
					const lastTransit = transitSegments[transitSegments.length - 1];
					let lastEndPos;
					
					if (lastTransit.mode === 'BUS') {
						lastEndPos = new window.kakao.maps.LatLng(lastTransit.end_blat, lastTransit.end_blon);
					} else if (lastTransit.mode === 'SUBWAY') {
						lastEndPos = new window.kakao.maps.LatLng(lastTransit.end_slat, lastTransit.end_slon);
					}
					
					if (lastEndPos) {
						const walkFromLast = new window.kakao.maps.Polyline({
							path: [lastEndPos, endPosition],
							strokeWeight: 4,
							strokeColor: '#F0F0F0',
							strokeOpacity: 0.8,
							strokeStyle: 'shortdash'
						});
						walkFromLast.setMap(map);
						console.log('🚶 마지막 하차지→도착지 도보 경로 그리기');
					}
				}

				segments.forEach((segment, index) => {
					if (segment.mode === 'BUS' || segment.mode === 'SUBWAY') {
						let startPos, endPos;
						
						// 버스와 지하철 좌표 필드명이 다름
						if (segment.mode === 'BUS') {
							startPos = new window.kakao.maps.LatLng(segment.start_blat, segment.start_blon);
							endPos = new window.kakao.maps.LatLng(segment.end_blat, segment.end_blon);
						} else if (segment.mode === 'SUBWAY') {
							startPos = new window.kakao.maps.LatLng(segment.start_slat, segment.start_slon);
							endPos = new window.kakao.maps.LatLng(segment.end_slat, segment.end_slon);
						}
						
						if (startPos && endPos) {
							bounds.extend(startPos);
							bounds.extend(endPos);
							
							// 전체 경로에 좌표 추가 (첫 번째 segment의 시작점과 모든 segment의 끝점)
							if (index === 0) {
								allRoutePoints.push(startPos);
							}
							allRoutePoints.push(endPos);
							
							

							// 지하철 호선별 색상 코드 (RouteBox와 동일)
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
								'GTX-A': '#BB1834',
								'GTX-B': '#0090D2',
								'GTX-C': '#009D3E'
							};
							
							// 대중교통 색상 결정
							let transitColor = '#4285F4'; // 기본 버스 색상
							
							if (segment.mode === 'BUS') {
								transitColor = '#4285F4';
							} else if (segment.mode === 'SUBWAY') {
								// "수도권" 접두사와 "_숫자" 접미사 제거
								const lineName = segment.subway_line?.replace(/^수도권/, '').replace(/_\d+$/, '');
								transitColor = subwayLineColors[lineName] || '#34A853';
								
								console.log('🚇 지하철 경로 색상:', {
									originalLine: segment.subway_line,
									processedLine: lineName,
									color: transitColor
								});
							}
							
							// 메인 경로선
							const transitPolyline = new window.kakao.maps.Polyline({
								path: [startPos, endPos],
								strokeWeight: 8,
								strokeColor: transitColor,
								strokeOpacity: 0.8,
								strokeStyle: 'solid'
							});
							transitPolyline.setMap(map);

							// 글로우 효과
							const glowPolyline = new window.kakao.maps.Polyline({
								path: [startPos, endPos],
								strokeWeight: 14,
								strokeColor: transitColor,
								strokeOpacity: 0.3,
								strokeStyle: 'solid'
							});
							glowPolyline.setMap(map);
						}
					}
				});

				// 전체 경로를 연결하는 얇은 가이드 라인 (회색 점선)
				if (allRoutePoints.length > 1) {
					console.log('🗺️ 전체 연결 경로 그리기:', allRoutePoints.length, '개 좌표점');
					
					const guidePolyline = new window.kakao.maps.Polyline({
						path: allRoutePoints,
						strokeWeight: 2,
						strokeColor: '#666666',
						strokeOpacity: 0.6,
						strokeStyle: 'shortdash'
					});
					guidePolyline.setMap(map);
				}
			} else {
				console.log('🚌 직선 대중교통 경로 사용 (segments 없음)');
				console.log('📊 segments 상태:', { segments, hasSegments: !!segments, segmentsLength: segments?.length });
				
				// segments가 없으면 직선으로 표시 (실선)
				const transitPolyline = new window.kakao.maps.Polyline({
					path: [startPosition, endPosition],
					strokeWeight: 6,
					strokeColor: '#4285F4',
					strokeOpacity: 0.8,
					strokeStyle: 'solid'
				});
				transitPolyline.setMap(map);
			}

			// 지도 범위 조정
			map.setBounds(bounds);

		} catch (error) {
			console.error('❌ 대중교통 경로 그리기 실패:', error)
		}
	}

	// 경로 그리기
	const drawRoute = (map, route, startCoords, endCoords) => {
		try {
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

			// 네온 효과가 적용된 커스텀 마커 생성
			const startPosition = new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng);
			const endPosition = new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng);

			const startMarker = createNeonMarker(startPosition, startColor, startName || '출발지', startIndex);
			const endMarker = createNeonMarker(endPosition, endColor, endName || '도착지', endIndex);

			startMarker.setMap(map);
			endMarker.setMap(map);

			// 마커 클릭 이벤트 - 툴팁 표시 (일반 경로)
			let startTooltip = null;
			let endTooltip = null;

			// 출발지 마커 클릭 이벤트
			startMarker.getContent().addEventListener('click', () => {
				// 기존 툴팁들 제거
				if (endTooltip) {
					endTooltip.setMap(null);
				}
				if (startTooltip) {
					startTooltip.setMap(null);
					startTooltip = null;
				} else {
					startTooltip = createTooltip(startPosition, startName || '출발지');
					startTooltip.setMap(map);
				}
			});

			// 도착지 마커 클릭 이벤트
			endMarker.getContent().addEventListener('click', () => {
				// 기존 툴팁들 제거
				if (startTooltip) {
					startTooltip.setMap(null);
				}
				if (endTooltip) {
					endTooltip.setMap(null);
					endTooltip = null;
				} else {
					endTooltip = createTooltip(endPosition, endName || '도착지');
					endTooltip.setMap(map);
				}
			});

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

			// 경로선 그리기 (출발지에서 도착지까지 그라디언트, 네온 효과)
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
						const currentColor = interpolateColor(ratio);
						
						// 메인 경로선
						const mainPolyline = new window.kakao.maps.Polyline({
							path: segmentPaths,
							strokeWeight: 6,
							strokeColor: currentColor,
							strokeOpacity: 1,
							strokeStyle: 'solid'
						});
						mainPolyline.setMap(map);
						
						// 네온 글로우 효과를 위한 추가 경로선 (더 굵고 투명)
						const glowPolyline = new window.kakao.maps.Polyline({
							path: segmentPaths,
							strokeWeight: 12,
							strokeColor: currentColor,
							strokeOpacity: 0.3,
							strokeStyle: 'solid'
						});
						glowPolyline.setMap(map);
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
