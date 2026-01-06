import { createRouter, createWebHistory } from 'vue-router';
import ProjectList from '../views/ProjectList.vue';
import Login from '../views/Login.vue';
import { getToken } from '../utils/auth';
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/',
        redirect: '/projects',
    },
    {
        path: '/projects',
        name: 'ProjectList',
        component: ProjectList,
        meta: {
            requiresAuth: true,
        },
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
/**
 * 全局路由守卫：鉴权
 */
router.beforeEach((to) => {
    if (!to.meta.requiresAuth) {
        return true;
    }
    const token = getToken();
    if (!token) {
        return {
            path: '/login',
            query: { redirect: to.fullPath },
        };
    }
    return true;
});
export default router;
