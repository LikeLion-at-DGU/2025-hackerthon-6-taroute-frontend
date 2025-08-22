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
    const fullUrl = `${instance.defaults.baseURL}/places/save_place`;
    const existingSessionKey = getSessionKey();

        // Ensure we send a raw, not double-encoded, place_id
        let decodedId = googlePlaceId;
        try { decodedId = decodeURIComponent(googlePlaceId); } catch {}

        const res = await instance.get("/places/save_place", {
            params: {
                place_id: decodedId,
                ...(existingSessionKey ? { session_key: existingSessionKey } : {})
            }
        });
        
        // 세션 키 저장 - 원본 응답 본문/헤더/데이터에서 모두 시도
        const pickSessionKeyFromData = (obj) => {
            if (!obj || typeof obj !== 'object') return undefined;
            const keys = Object.keys(obj);
            // 키 정규화: 공백/보이지 않는 문자 제거, 소문자화
            const norm = (s) => s.replace(/[\uFEFF\u2060\u200B\s]/g, '').toLowerCase();
            const targetNames = new Set(['session_key', 'sessionkey']);
            for (const k of keys) {
                if (targetNames.has(norm(k))) {
                    return obj[k];
                }
            }
            return undefined;
        };

        const headerSessionKey = res.headers?.["session_key"] || res.headers?.["x-session-key"]; 
        let rawBodySessionKey = undefined;
        try {
            const raw = typeof res.data === 'string' ? res.data : (res.request?.responseText || res.request?.response);
            if (raw && typeof raw === 'string') {
                const parsed = JSON.parse(raw);
                rawBodySessionKey = parsed?.session_key;
            }
        } catch (e) {
            // raw 파싱 실패는 무시
        }
        const dataSessionKeyLoose = pickSessionKeyFromData(res.data);
        const sessionKey = headerSessionKey || rawBodySessionKey || dataSessionKeyLoose;

        console.log('🔍 세션키 검색 결과:', {
            headerSessionKey,
            rawBodySessionKey,
            dataSessionKey: res.data?.session_key,
            dataSessionKeyLoose: dataSessionKeyLoose,
            final_sessionKey: sessionKey,
            responseKeys: res?.data ? Object.keys(res.data) : null
        });

        if (sessionKey) {
            saveSessionKey(sessionKey);
            console.log('🔑 세션 키 저장됨:', sessionKey);
        } else {
            console.log('⚠️ 세션 키를 찾을 수 없음:', {
                responseKeys: res?.data ? Object.keys(res.data) : null,
                preview: res?.data
            });
        }
        
        // 반환 데이터도 텍스트일 수 있으므로 객체로 파싱 후 반환
        try {
            const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            return parsed;
        } catch {
            return res.data;
        }
    } catch (err) {
        console.error("❌ 장소 저장 실패:", {
            googlePlaceId: googlePlaceId,
            paramType: typeof googlePlaceId,
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            config: {
                url: err.config?.url,
                baseURL: err.config?.baseURL,
                fullURL: err.config?.baseURL + err.config?.url
            }
        });
        // 실패 응답에서도 세션키 시도 추출 및 저장
        try {
            const resData = err.response?.data;
            const asText = typeof resData === 'string' ? resData : JSON.stringify(resData);
            let parsed;
            try { parsed = typeof resData === 'string' ? JSON.parse(resData) : resData; } catch { parsed = undefined; }
            const pickSessionKeyFromData = (obj) => {
                if (!obj || typeof obj !== 'object') return undefined;
                const keys = Object.keys(obj);
                const norm = (s) => s.replace(/[\uFEFF\u2060\u200B\s]/g, '').toLowerCase();
                const targetNames = new Set(['session_key', 'sessionkey']);
                for (const k of keys) if (targetNames.has(norm(k))) return obj[k];
                return undefined;
            };
            const headerSessionKey = err.response?.headers?.["session_key"] || err.response?.headers?.["x-session-key"]; 
            const dataSessionKeyLoose = pickSessionKeyFromData(parsed);
            const failSessionKey = headerSessionKey || dataSessionKeyLoose;
            if (failSessionKey) {
                console.log('🆗 실패 응답에서 세션키 확보, 저장:', failSessionKey);
                saveSessionKey(failSessionKey);
            } else {
                console.log('ℹ️ 실패 응답 본문(미파싱):', asText);
            }
        } catch {}
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
        console.log('🌐 getSavedPlaces API 호출 준비:', {
            baseURL: instance.defaults.baseURL,
            envBaseURL: import.meta.env.VITE_BASE_URL,
            sessionKey: sessionKey,
            hasSessionKey: !!sessionKey
        });

        // 세션키가 없어도 일단 서버 조회 시도
        if (!sessionKey) {
            console.log('⚠️ 세션 키가 없지만 서버 조회 시도...');
        }

        const fullUrl = `${instance.defaults.baseURL}/places/get_saved_places`;
        console.log('🌐 getSavedPlaces API 호출:', {
            fullUrl: fullUrl,
            sessionKey: sessionKey
        });
        
        // 세션키가 있으면 파라미터로, 없으면 파라미터 없이 요청
        const params = sessionKey ? { session_key: sessionKey } : {};
        const res = await instance.get("/places/get_saved_places", { params });
        
        console.log('📋 getSavedPlaces API 응답:', {
            status: res.status,
            data: res.data,
            dataType: typeof res.data,
            dataKeys: res.data ? Object.keys(res.data) : null,
            placesData: res.data.places,
            placesType: typeof res.data.places,
            placesIsArray: Array.isArray(res.data.places),
            placesKeys: res.data.places ? Object.keys(res.data.places) : null,
            placesValues: res.data.places ? Object.values(res.data.places) : null,
            session_key_in_response: res.data.session_key,
            headers: res.headers,
            fullResponse: JSON.stringify(res.data, null, 2)
        });
        
        // 응답에서 세션키를 얻을 수 있다면 저장 (헤더/원본문/데이터-정규화 순)
        const headerSessionKey = res.headers?.["session_key"] || res.headers?.["x-session-key"]; 
        let rawBodySessionKey = undefined;
        try {
            const raw = res.request?.responseText || res.request?.response;
            if (raw && typeof raw === 'string') {
                const parsed = JSON.parse(raw);
                rawBodySessionKey = parsed?.session_key;
            }
        } catch {}
        const pickSessionKeyFromData = (obj) => {
            if (!obj || typeof obj !== 'object') return undefined;
            const keys = Object.keys(obj);
            const norm = (s) => s.replace(/[\uFEFF\u2060\u200B\s]/g, '').toLowerCase();
            const targetNames = new Set(['session_key', 'sessionkey']);
            for (const k of keys) {
                if (targetNames.has(norm(k))) {
                    return obj[k];
                }
            }
            return undefined;
        };
        const dataSessionKeyLoose = pickSessionKeyFromData(res.data);
        const responseSessionKey = headerSessionKey || rawBodySessionKey || dataSessionKeyLoose;
        if (responseSessionKey && !sessionKey) {
            console.log('🔑 응답에서 새 세션키 발견, 저장:', responseSessionKey);
            saveSessionKey(responseSessionKey);
        }
        
        // 서버 응답 전체 구조 확인
        console.log('🔍 서버 응답 원본:', res.data);
        console.log('🔍 서버 응답 전체 키:', res.data ? Object.keys(res.data) : null);
        
        // places 객체에서 배열로 변환
        const placesData = res.data.places;
        
        if (placesData && typeof placesData === 'object' && !Array.isArray(placesData)) {
            // places가 객체인 경우 배열로 변환하면서 place_id 추가
            const placesArray = Object.entries(placesData).map(([placeId, placeData]) => ({
                ...placeData,
                id: placeId, // Google Place ID를 id 필드로 추가
                place_id: placeId // 원본 필드명도 유지
            }));
            
            console.log('🔄 객체를 배열로 변환:', {
                originalObject: placesData,
                objectKeys: Object.keys(placesData),
                convertedArray: placesArray,
                arrayLength: placesArray.length
            });
            return placesArray;
        }
        
        // places가 배열인 경우 그대로 반환
        if (Array.isArray(placesData)) {
            console.log('✅ 이미 배열 형태:', placesData);
            return placesData;
        }
        
        // 데이터가 없으면 빈 배열 반환
        console.log('🔄 데이터가 없어서 빈 배열 반환');
        return [];
    } catch (err) {
        console.error("❌ 저장된 장소 조회 실패:", {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            config: {
                url: err.config?.url,
                baseURL: err.config?.baseURL,
                fullURL: err.config?.baseURL + err.config?.url
            }
        });
        throw err;
    }
};