import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // 항상 백엔드 주소 사용
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 20000,
    // 개발 환경에서 SSL 검증 우회 (브라우저에서는 직접적으로 제어 불가)
    validateStatus: function (status) {
        return status >= 200 && status < 300; // 기본값
    }
});