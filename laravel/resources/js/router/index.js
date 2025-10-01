import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import NotFoundView from "../pages/NotFoundView.vue";

const routes = [
    {
        // Path should match exactly "/" and redirect to the 'Login' named route.
        path: "/",
        redirect: { name: "Login" },
    },
    {
        // Use path: "/login" without a trailing slash and with 'exact' behavior.
        path: "/login",
        name: "Login",
        component: Login,
    },

    {
        // Use path: "/login" without a trailing slash and with 'exact' behavior.
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
    },

    // Catch-all for 404 - MUST be the last route in the array.
    // or any other invalid path
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFoundView,
    },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
