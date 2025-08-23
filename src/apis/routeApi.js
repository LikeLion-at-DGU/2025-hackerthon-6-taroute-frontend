

import { instance } from "./instance";

export const getRouteInfo = async ({ destination_x, destination_y, origin_x, origin_y, transport } = {}) => {
    try {
        const res = await instance.post("/routes/path", {
            destination_x, 
            destination_y, 
            origin_x, 
            origin_y, 
            transport 
        });
        return res.data; // axios는 응답 본문을 data에 담아 줌
    } catch (err) {
        console.error(err);
        throw err;
    }
};