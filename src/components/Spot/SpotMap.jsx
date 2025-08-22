import { useEffect, useRef, useState } from 'react'

/**
 * SpotMap: 두 지점(시작/도착) 사이 경로를 그리는 Tmap 컴포넌트
 * - props로 start/end를 넘기지 않으면 샘플 좌표 사용
 */
const SpotMap = ({
	start = { lat: 37.566567545861645, lng: 126.9850380932383 },
	end = { lat: 37.403049076341794, lng: 127.10331814639885 },
	searchOption = '0', // 교통최적+추천
	trafficInfo = 'N',  // 교통정보 표출 옵션
	height = 300,
}) => {
		const [ready, setReady] = useState(!!window.Tmapv2)
	const mapRef = useRef(null)
	const mapObjRef = useRef(null)
	const linesRef = useRef([])
	const markersRef = useRef([])
	const [summary, setSummary] = useState(null)

		// 전역 SDK 존재 감시 (index.html에서 선로드를 시도하므로 보조용)
		useEffect(() => {
			if (window.Tmapv2) setReady(true)
			else {
				const id = setInterval(() => { if (window.Tmapv2) { setReady(true); clearInterval(id) } }, 100)
				return () => clearInterval(id)
			}
		}, [])

	// 지도 초기화
	useEffect(() => {
		if (!ready) return
		const { Tmapv2 } = window
		if (!Tmapv2) return

		// 맵 생성 (시작/도착 중간 지점 센터)
		const centerLat = (start.lat + end.lat) / 2
		const centerLng = (start.lng + end.lng) / 2
		const map = new Tmapv2.Map(mapRef.current, {
			center: new Tmapv2.LatLng(centerLat, centerLng),
			width: '100%',
			height: `${height}px`,
			zoom: 12,
			zoomControl: true,
			scrollwheel: true,
		})
		mapObjRef.current = map

		// 시작/도착 마커
		const mStart = new Tmapv2.Marker({ position: new Tmapv2.LatLng(start.lat, start.lng), map })
		const mEnd = new Tmapv2.Marker({ position: new Tmapv2.LatLng(end.lat, end.lng), map })
		markersRef.current.push(mStart, mEnd)

		// 경로 요청 및 그리기
		drawRoute({ Tmapv2, start, end, searchOption, trafficInfo, setSummary })

		return () => {
			// 정리
			markersRef.current.forEach(m => m.setMap(null))
			markersRef.current = []
			linesRef.current.forEach(l => l.setMap(null))
			linesRef.current = []
			if (mapObjRef.current) {
				mapObjRef.current.destroy && mapObjRef.current.destroy()
				mapObjRef.current = null
			}
		}
	}, [ready, start.lat, start.lng, end.lat, end.lng, searchOption, trafficInfo, height])

	// 경로 그리기 함수
		const drawRoute = async ({ Tmapv2, start, end, searchOption, trafficInfo, setSummary }) => {
		try {
			// 기존 라인/포인트 제거
			linesRef.current.forEach(l => l.setMap(null))
			linesRef.current = []

			// API 호출 (POST x-www-form-urlencoded)
			const url = 'https://apis.openapi.sk.com/tmap/routes?version=1&format=json'
			const params = new URLSearchParams({
				startX: String(start.lng),
				startY: String(start.lat),
				endX: String(end.lng),
				endY: String(end.lat),
				reqCoordType: 'WGS84GEO',
				resCoordType: 'EPSG3857',
				searchOption: String(searchOption),
				trafficInfo: String(trafficInfo),
			})
			const res = await fetch(url, {
				method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							appKey: import.meta.env.VITE_TMAP_API_KEY,
						},
				body: params.toString(),
			})
			if (!res.ok) throw new Error(`Tmap routes error: ${res.status}`)
			const data = await res.json()
			const features = data?.features || []

			// 요약 정보
			if (features[0]?.properties) {
				const p = features[0].properties
				setSummary({
					distanceKm: (p.totalDistance / 1000).toFixed(1),
					timeMin: Math.round(p.totalTime / 60),
					fare: p.totalFare,
					taxiFare: p.taxiFare,
				})
			}

			// 라인/포인트 그리기
			const path = []
			for (const f of features) {
				const g = f.geometry
				if (g.type === 'LineString') {
					for (const [x, y] of g.coordinates) {
						const pt = new Tmapv2.Point(x, y)
						const wgs = Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pt)
						path.push(new Tmapv2.LatLng(wgs._lat, wgs._lng))
					}
				}
			}
			if (path.length) {
				const polyline = new Tmapv2.Polyline({
					path,
					strokeColor: '#DD0000',
					strokeWeight: 6,
					map: mapObjRef.current,
				})
				linesRef.current.push(polyline)
				// 경로가 보이도록 bounds 맞춤
				const bounds = new Tmapv2.LatLngBounds()
				path.forEach(p => bounds.extend(p))
				mapObjRef.current.fitBounds(bounds)
			}
		} catch (e) {
			console.error('Tmap 경로 탐색 실패:', e)
		}
	}

	return (
		<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<div ref={mapRef} style={{ width: '343px', height: `${height}px`, borderRadius: 12, overflow: 'hidden' }} />
			{summary && (
				<div style={{ width: '343px', marginTop: 8, fontSize: 12, color: '#555' }}>
					총 거리: {summary.distanceKm}km · 총 시간: {summary.timeMin}분 · 요금: {summary.fare.toLocaleString()}원 · 택시: {summary.taxiFare.toLocaleString()}원
				</div>
			)}
		</div>
	)
}

export default SpotMap