import { createRouter, createWebHistory } from 'vue-router';
import ProjectList from "../views/ProjectList.vue";
const routes = [
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
];
let router;
router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
