import axios from "axios";

// CSRF 토큰을 쿠키에서 가져오는 함수
function getCsrfToken() {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

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

// 요청 인터셉터에서 CSRF 토큰 추가
instance.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});