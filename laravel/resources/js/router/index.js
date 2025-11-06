import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import NotFoundView from "../pages/NotFoundView.vue";
import { useAuthStore } from "@/stores/auth";
import ForgotPassword from "@/pages/ForgotPassword.vue";
import ResetPassword from "@/pages/ResetPassword.vue";
import GoogleCallback from "@/pages/GoogleCallback.vue";
import Unauthorized from "@/pages/NotAuthorized.vue";

/** @type {import('vue-router').RouteRecordRaw[]} */
const routes = [
    {
        // Path should match exactly "/" and redirect to the 'Login' named route.
        path: "/",
        redirect: "/login",
    },
    {
        // "/login" without a trailing slash and with 'exact' behavior.
        path: "/login",
        name: "Login",
        component: Login,
        meta: { guestOnly: true }, // logged-out users only
    },

    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true }, // must be logged in
    },

    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
        meta: { guestOnly: true },
    },

    {
        path: "/reset-password",
        name: "ResetPassword",
        component: ResetPassword,
        meta: { guestOnly: true },
    },

    {
        path: "/auth/callback",
        name: "GoogleCallback",
        component: GoogleCallback,
        meta: { public: true }, // no auth required here
    },

    {
        path: "/unauthorized",
        name: "NotAuthorized",
        component: Unauthorized,
        meta: { public: true },
    },

    // Catch-all for 404 - MUST be the last route in the array.
    // or any other invalid path
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFoundView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    // @ts-ignore
    routes,
});

router.beforeEach(async (to, from) => {
    const auth = useAuthStore();

    // Only try restoring session if route REQUIRES AUTH
    // If user is unknown, try restoring session
    if (to.meta.requiresAuth && !auth.user && auth.token) {
        try {
            await auth.getUser();
            console.log("User session restored in router");
        } catch (error) {
            console.error("Session restore failed:", error);
            auth.token = null;
            localStorage.removeItem("token");
        }
    }

    // Protected route
    //if route requires auth and user is not authenticated, redirect to login
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: "Login" };
    }

    // Prevent logged-in users from accessing guest-only routes
    // if logged in, stay on dashboard
    if (to.meta.guestOnly && auth.isAuthenticated) {
        return { name: "Dashboard" };
    }
});

export default router;
