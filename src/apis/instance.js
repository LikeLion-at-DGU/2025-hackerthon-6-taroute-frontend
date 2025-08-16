import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // 항상 백엔드 주소 사용
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});