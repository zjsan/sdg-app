import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
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
    // other routes...
    // Catch-all for 404 - MUST be the last route in the array.
    // This will correctly catch '/login/asda' (or any other invalid path)
    // because '/login' no longer matches it.
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
