import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../views/Layout.vue'; // 主布局
import ProjectList from '../views/ProjectList.vue';
import Login from '../views/Login.vue';
import { getToken } from '../utils/auth';
import ProjectListDEV from "../views/ProjectListDEV.vue";
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login, // 登录页独立，不在 Layout 内
    },
    {
        path: '/',
        component: Layout, // 登录后显示主布局
        meta: { requiresAuth: true },
        children: [
            {
                path: 'projects',
                name: 'ProjectList',
                component: ProjectList,
            },
            {
                path: 'projectsDEV',
                name: 'ProjectListDEV',
                component: ProjectListDEV,
            },
            {
                path: '',
                redirect: 'projects', // 根路径访问时默认跳到项目列表
            },
        ],
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
// 全局路由守卫
router.beforeEach((to) => {
    // 不需要登录的页面直接通过
    if (!to.meta.requiresAuth) {
        return true;
    }
    // 获取 token 判断是否登录
    const token = getToken();
    if (!token) {
        // 未登录，跳转 login
        return {
            path: '/login',
            query: { redirect: to.fullPath }, // 登录后可重定向
        };
    }
    return true;
});
export default router;
