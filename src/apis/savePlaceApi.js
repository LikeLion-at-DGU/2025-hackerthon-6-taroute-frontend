import { instance } from "./instance";
import { saveSessionKey, getSessionKey } from "../utils/sessionUtils";

/**
 * 장소를 서버에 저장하는 API
 * @param {string} googlePlaceId - 저장할 장소의 Google Place ID (문자열)
 * @returns {Promise<any>} - 서버 응답 데이터
 */
export const savePlaceToServer = async (googlePlaceId) => {
    if (!googlePlaceId || typeof googlePlaceId !== 'string') {
        throw new Error("googlePlaceId(string) is required");
    }

    try {
        const existingSessionKey = getSessionKey();
        // place_id는 디코딩된 원본을 전송
        let decodedId = googlePlaceId;
        try { decodedId = decodeURIComponent(googlePlaceId); } catch {}

        const res = await instance.get("/places/save_place", {
            params: {
                place_id: decodedId,
                ...(existingSessionKey ? { session_key: existingSessionKey } : {})
            }
        });

        console.log('🔥응답 전체:', res);
        console.log('🔥응답 헤더:', res.headers);
        console.log('🔥응답 데이터:', res.data);
        console.log('🔥s응답 상태:', res.status);
        console.log('응답 데이터 구조 전체:', JSON.stringify(res.data, null, 2));

        const responseData = res.data; // axios 응답의 실제 데이터
        const dataPayload = responseData.data; // 'data' 키 아래의 데이터
        const sessionKey = responseData.session_key; // 최상위 session_key

        console.log('📋 받아온 장소 데이터 상세:', {
            place_name: dataPayload?.place_name,
            address: dataPayload?.address,
            location: dataPayload?.location,
            running_time: dataPayload?.running_time,
            place_photos_count: dataPayload?.place_photos?.length || 0,
            place_photos_urls: dataPayload?.place_photos,
            session_key: sessionKey, // 최상위 세션키를 사용
            message: responseData?.message,
            전체응답구조: Object.keys(responseData || {})
        });

        if (sessionKey) {
            saveSessionKey(sessionKey);
            console.log('🔑 세션 키 저장됨:', sessionKey);
        } else {
            console.log('⚠️ 응답에 세션키가 없음 - 값:', sessionKey, '타입:', typeof sessionKey);
        }

        return dataPayload; // 필요한 경우 data 내부의 페이로드만 반환

    } catch (err) {
        console.error("❌ 장소 저장 실패:", {
            googlePlaceId: googlePlaceId,
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
        });
        throw err;
    }
};

/**
 * 저장된 장소들을 가져오는 API
 * @returns {Promise<any>} - 저장된 장소 목록
 */
export const getSavedPlaces = async () => {
    try {
        const sessionKey = getSessionKey();

        const params = sessionKey ? { session_key: sessionKey } : {};
        const res = await instance.get("/places/get_saved_places", { params });

        console.log('📋 getSavedPlaces API 응답:', res.data);

        // 응답에서 세션키가 있으면 저장
        const responseSessionKey = res.data?.session_key;
        if (responseSessionKey && !sessionKey) {
            console.log('🔑 응답에서 새 세션키 발견, 저장:', responseSessionKey);
            saveSessionKey(responseSessionKey);
        }

        // places 객체에서 배열로 변환
        const placesData = res.data?.places;

        if (placesData && typeof placesData === 'object' && !Array.isArray(placesData)) {
            // places가 객체인 경우 배열로 변환하면서 place_id 추가
            const placesArray = Object.entries(placesData).map(([placeId, placeData]) => ({
                ...placeData,
                id: placeId, // Google Place ID를 id 필드로 추가
                place_id: placeId // 원본 필드명도 유지
            }));

            return placesArray;
        }

        // places가 배열인 경우 그대로 반환
        if (Array.isArray(placesData)) {
            return placesData;
        }

        // 데이터가 없으면 빈 배열 반환
        return [];
    } catch (err) {
        console.error("❌ 저장된 장소 조회 실패:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
        });
        throw err;
    }
};