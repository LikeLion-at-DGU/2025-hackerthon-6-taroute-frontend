import { instance } from "./instance";

/**
 * 경로 공유 URL 생성 API
 * @param {Object} shareData - 공유할 경로 데이터
 * @param {Object} shareData.start - 출발지 정보
 * @param {Object} shareData.end - 도착지 정보  
 * @param {Object} shareData.ui - UI 설정 정보
 * @returns {Promise} 공유 URL 응답
 */
export const createShareUrl = async (shareData) => {
    try {
        console.log('🔗 공유 URL 생성 요청:', shareData);

        const requestData = {
            params: shareData
        };

        const res = await instance.post("/routes/snapshots", requestData);
        
        console.log('✅ 공유 URL 생성 성공:', res.data);
        return res.data;
    } catch (err) {
        console.error('❌ 공유 URL 생성 실패:', {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data
        });
        throw err;
    }
};

/**
 * 공유된 경로 데이터 조회 API
 * @param {string} shareId - 공유 ID
 * @returns {Promise} 공유된 경로 데이터 응답
 */
export const getSharedRoute = async (shareId) => {
    try {
        console.log('🔗 공유 경로 조회 요청:', shareId);

        const res = await instance.get(`/routes/snapshots/${shareId}`);
        
        console.log('✅ 공유 경로 조회 성공:', res.data);
        return res.data;
    } catch (err) {
        console.error('❌ 공유 경로 조회 실패:', {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data
        });
        throw err;
    }
};
