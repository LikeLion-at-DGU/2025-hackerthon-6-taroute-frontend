import { instance } from "./instance";

/**
 * 장소 검색 API 호출
 * @param {Object} args
 * @param {string} args.q              - 검색어(필수)
 * @param {number} args.x              - 현재 위도(필수)
 * @param {number} args.y              - 현재 경도(필수)
 * @param {string} args.rankPreference - 정렬 기준 ("RELEVANCE", "DISTANCE")
 * @param {string} args.priceLevel     - 가격 수준 ("PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE")
 * @param {string} args.sortType       - 클라이언트 정렬 타입 ("정확도순", "거리순", "후기순", "인기순", "가격낮은순", "가격높은순")
 * @returns {Promise<any>}             - 서버에서 내려주는 data
 */
export const getSearchPlace = async ({ 
    q, 
    x, 
    y, 
    rankPreference = "RELEVANCE", 
    priceLevel, 
    sortType = "정확도순" 
} = {}) => {
    if (!q) throw new Error("q is required");
    if (typeof x !== "number" || typeof y !== "number") {
        throw new Error("x, y must be numbers (latitude/longitude)");
    }

    try {
        // API 파라미터 구성
        const params = { 
            q, 
            x, 
            y, 
            rankPreference, 
            radius: 2000 
        };
        
        // 가격 정렬인 경우에만 priceLevel 추가
        if (priceLevel) {
            params.priceLevel = priceLevel;
        }
        
        console.log('🔍 검색 API 파라미터:', params);
        
        const res = await instance.get("/places/google_place", { params });
        
        // 응답 데이터에서 장소 목록 추출
        const places = Array.isArray(res.data.google_place) ? res.data.google_place :
                      Array.isArray(res.data.results) ? res.data.results :
                      Array.isArray(res.data.items) ? res.data.items :
                      Array.isArray(res.data) ? res.data : [];
        
        // 클라이언트 정렬 적용
        const sortedPlaces = sortPlaces(places, sortType);
        
        return {
            ...res.data,
            google_place: sortedPlaces
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * 클라이언트에서 장소 목록을 정렬하는 함수
 * @param {Array} places - 정렬할 장소 목록
 * @param {string} sortType - 정렬 기준
 * @returns {Array} - 정렬된 장소 목록
 */
const sortPlaces = (places, sortType) => {
    if (!Array.isArray(places)) return [];
    
    const sortedPlaces = [...places];
    
    switch (sortType) {
        case "후기순":
            return sortedPlaces.sort((a, b) => (b.reviewcount || 0) - (a.reviewcount || 0));
        case "인기순":
            return sortedPlaces.sort((a, b) => (b.click_num || 0) - (a.click_num || 0));
        case "정확도순":
        case "거리순":
        case "가격낮은순":
        case "가격높은순":
        default:
            // API에서 이미 정렬되어 온 순서 유지
            return sortedPlaces;
    }
};

/**
 * 위치 검색 API 호출
 * @param {string} query - 검색할 위치명
 * @returns {Promise<any>} - 서버에서 내려주는 위치 데이터
 */
export const getLocationSearch = async (query) => {
    if (!query) throw new Error("query is required");

    try {
        const res = await instance.get("/places/locate", {
            params: { query },
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

/**
 * 추천 장소 API 호출
 * @param {Object} args
 * @param {number} args.x - 경도(필수)
 * @param {number} args.y - 위도(필수)
 * @returns {Promise<any>} - 서버에서 내려주는 추천 장소 데이터
 */
export const getRecommend = async ({ x, y } = {}) => {
    if (typeof x !== "number" || typeof y !== "number") {
        throw new Error("x, y must be numbers (latitude/longitude)");
    }

    try {
        const res = await instance.get("/places/recommend", {
            params: { x, y, radius:2000 },
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};