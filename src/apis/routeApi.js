

import { instance } from "./instance";

export const getRouteInfo = async ({ destination_x, destination_y, origin_x, origin_y, transport, startName, endName } = {}) => {
    try {
        const requestData = {
            destination_x, 
            destination_y, 
            origin_x, 
            origin_y, 
            transport
        };

        // walk일 때는 startName, endName 추가
        if (transport === 'walk' && startName && endName) {
            requestData.startName = startName;
            requestData.endName = endName;
        }

        console.log('🔥 routeApi 요청 데이터:', {
            url: "/routes/path",
            method: "POST",
            params: requestData,
            transport: transport,
            isWalk: transport === 'walk',
            hasNames: !!(startName && endName)
        });

        // Query Parameters로 전송 (body는 null)
        const res = await instance.post("/routes/path", null, {
            params: requestData
        });
        
        console.log('✅ routeApi 성공 응답:', res.data);
        return res.data; // axios는 응답 본문을 data에 담아 줌
    } catch (err) {
        console.error('❌ routeApi 에러:', {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            config: {
                url: err.config?.url,
                method: err.config?.method,
                data: err.config?.data
            }
        });
        throw err;
    }
};