import {createRouter, createWebHistory, Router, RouteRecordRaw} from 'vue-router'
import ProjectList from "../views/ProjectList.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        redirect: '/projects',
    },
    {
        path: '/projects',
        name: 'ProjectList',
        component: ProjectList
    }
]

let router: Router;
router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
