import { instance } from "./instance";

/**
 * 장소 검색 API 호출
 * @param {Object} args
 * @param {string} args.q            - 검색어(필수)
 * @param {number} args.x            - 현재 위도(필수)
 * @param {number} args.y            - 현재 경도(필수)
 * @returns {Promise<any>}           - 서버에서 내려주는 data
 */

export const getSearchPlace = async ({ q, x, y } = {}) => {
    if (!q) throw new Error("q is required");
    if (typeof x !== "number" || typeof y !== "number") {
        throw new Error("x, y must be numbers (latitude/longitude)");
    }

    try {
        const res = await instance.get("/places/google_place", {
            params: { q, x, y, radius:2000 },
        });
        return res.data; // axios는 응답 본문을 data에 담아 줌
    } catch (err) {
        console.error(err);
        throw err;
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