import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import NotFoundView from "../pages/NotFoundView.vue";

const routes = [
    {
        path: "/",
        redirect: { name: "Login" }, // only root redirects
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    // other routes...
    // Catch-all for 404
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
