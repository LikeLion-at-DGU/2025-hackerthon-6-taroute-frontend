import { instance } from './instance'

const DEFAULT_X = 126.98364611778
const DEFAULT_Y = 37.565315667212

const mapCategory = (ko) => {
  switch (ko) {
    case '식당':
      return 'restaurant'
    case '카페':
      return 'cafe'
    case '문화시설':
      return 'culture'
    case '관광명소':
      return 'tourist_attraction'
    default:
      return 'restaurant'
  }
}

const mapDistance = (label) => {
  if (!label) return 'all'
  if (label.includes('1km')) return '1km'
  if (label.includes('3km')) return '3km'
  if (label.includes('5km 이상') || label.includes('5km_plus')) return '5km_plus'
  if (label.includes('5km')) return '5km'
  if (label === 'all') return 'all'
  return 'all'
}

const mapVisitTime = (label) => {
  if (!label) return 'all'
  if (label.startsWith('아침')) return 'morning'
  if (label.startsWith('낮')) return 'afternoon'
  if (label.startsWith('저녁')) return 'evening'
  if (label.startsWith('밤')) return 'night'
  if (label.startsWith('새벽')) return 'dawn'
  return 'all'
}

const mapVisitDay = (label) => {
  const table = {
    '월요일': 'monday',
    '화요일': 'tuesday',
    '수요일': 'wednesday',
    '목요일': 'thursday',
    '금요일': 'friday',
    '토요일': 'saturday',
    '일요일': 'sunday',
  }
  return table[label] || label
}

export async function fetchCategoryPlaces(query) {
  const params = {
    x: query?.x ?? DEFAULT_X,
    y: query?.y ?? DEFAULT_Y,
    text_query: query?.keyword || undefined,
    category: mapCategory(query?.category),
    radius: 5000,
    distance_filter: mapDistance(query?.distance) || 'all',
    visit_time_filter: mapVisitTime(query?.visitTime) || 'all',
    visit_days_filter: Array.isArray(query?.visitDays)
      ? query.visitDays.map(mapVisitDay).filter(Boolean)
      : (query?.visitDay ? [mapVisitDay(query.visitDay)].filter(Boolean) : undefined),
    sort_by: query?.sortBy || 'relevance',
    limit: query?.limit || 10,
  }

  const res = await instance.get('/places/category_search', { params })
  const places = res.data?.places || []

  return places.map((p) => ({
    id: p.place_id,
    name: p.place_name,
    images: Array.isArray(p.place_photos) ? p.place_photos.slice(0, 5) : [],
    distance: p.distance,
    address: p.address,
    time: Array.isArray(p.running_time) && p.running_time.length > 0 ? p.running_time[0] : (p.is_open_now === true ? '영업중' : (p.is_open_now === false ? '영업 종료' : '')),
  }))
}

// Wiki 검색 API를 카테고리 모듈에서도 사용할 수 있도록 래핑
export const searchWikiPlaces = async (params) => {
  const { latitude, longitude, place_name, radius, rankPreference } = params || {}
  const res = await instance.get('/wiki/search', {
    params: { latitude, longitude, place_name, radius, rankPreference },
  })
  return res.data?.google_place || []
}


