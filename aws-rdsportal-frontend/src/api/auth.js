import request from "../utils/request";
export const login = async (username, password) => {
    return request.post('/auth/login', { username, password });
};
