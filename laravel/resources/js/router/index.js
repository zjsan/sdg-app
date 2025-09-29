import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";

const routes = [
    {
        path: "/",
        redirect: "/login", // default redirect
    },
    {
        path: "/login",
        name: "Home",
        component: Home,
    },
    // other routes...
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
