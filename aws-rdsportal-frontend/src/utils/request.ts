import axios from 'axios'
import { getToken, clearToken } from './auth'
import router from '../router'

const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
})

/**
 * 请求拦截器：自动加 token
 */
request.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * 响应拦截器：统一处理 401
 */
request.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status

        if (status === 401) {
            console.warn('401 Unauthorized:', error.response.data)
            // 清理 token
            clearToken()

            // 避免重复跳转
            if (router.currentRoute.value.path !== '/login') {
                router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.value.fullPath },
                })
            }
        }

        // 把错误返回给调用者
        return Promise.reject(error)
    }
)

export default request
