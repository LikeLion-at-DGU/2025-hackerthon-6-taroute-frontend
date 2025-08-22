import { instance } from './instance'

// 3.1 최근 업데이트된 위키
export const getRecentWiki = async () => {
  const res = await instance.get('/wiki/reviews/recent5_wiki')
  return res.data?.recent_data || []
}

// 3.2 현재 핫한 게시판 (좋아요 상위 7)
export const getTopLikedWiki = async () => {
  const res = await instance.get('/wiki/reviews/top7_liked')
  return res.data?.top_data || []
}

// 3.3 위키 장소 검색
// params: { latitude, longitude, place_name, radius, rankPreference, sortBy }
export const searchWikiPlaces = async (params) => {
  const { latitude, longitude, place_name, radius, rankPreference } = params
  const res = await instance.get('/wiki/search', {
    params: {
      latitude,
      longitude,
      place_name,
      radius,
      rankPreference,
    },
  })
  return res.data?.google_place || []
}

// 3.4 장소 세부정보 (AI요약, 정보, 위키리뷰)
// params: { place_id, sortKey: '추천순' | '최신순' }
export const getWikiDetail = async (params) => {
  const res = await instance.get('/wiki/detail', { params })
  return res.data
}

// 3.4.1 위키 리뷰 좋아요 카운트
export const likeWikiReview = async ({ id, place_id }) => {
  const res = await instance.get(`/wiki/reviews/${id}/click_liked`, {
    params: { place_id },
  })
  return res.data
}

// 3.5 위키 리뷰 작성
// body: { review_content, review_score, review_image, place_name, gplace_id }
export const postWikiReview = async (body) => {
  const res = await instance.post('/wiki/reviews', body)
  return res.data
}


