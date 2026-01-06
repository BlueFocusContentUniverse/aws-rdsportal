import request from "../utils/request";

interface ProjectFilters {
    username?: string | null
    password?: string | null
}

export const login = async (username: string, password: string) => {
    return request.post('/auth/login', { username, password })
}