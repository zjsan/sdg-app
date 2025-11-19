import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import NotFoundView from "../pages/NotFoundView.vue";
import { useAuthStore } from "@/stores/auth";
import GoogleCallback from "../pages/GoogleCallback.vue";
import Unauthorized from "../pages/NotAuthorized.vue";
import AuthError from "../pages/AuthError.vue";
import SafeRedirect from "../pages/SafeRedirect.vue";

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
        path: "/auth/callback",
        name: "GoogleCallback",
        component: GoogleCallback,
        meta: { public: true }, // no auth required here
    },

    //frontend view for google authentication errors
    {
        path: "/unauthorized",
        name: "NotAuthorized",
        component: Unauthorized,
        meta: { public: true },
    },

    {
        path: "/auth-error",
        name: "AuthError",
        component: AuthError,
        meta: { public: true },
    },

    // NEW ISOLATION ROUTE
    {
        path: "/safe-redirect",
        name: "SafeRedirect",
        component: SafeRedirect,
        meta: { requiresAuth: true },
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
    const googleRedirectPattern = /auth\/google\/redirect/i; //url interceptor for fixing google callback when logged in and pressed the powerbi go back button

    // Check if the URL is trying to navigate to the Google redirect endpoint
    if (googleRedirectPattern.test(to.path)) {
        console.warn(
            "Intercepting potential faulty Google redirect. Forcing navigation reset."
        );

        // Trap the user on a harmless internal page instead of allowing the external redirect.
        if (auth.isAuthenticated) {
            return { name: "Dashboard", replace: true };
        } else {
            return { name: "Login", replace: true };
        }
    }

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

    // Intercept the faulty callback navigation if the user is already authenticated
    if (to.path.startsWith("/auth/callback") && auth.isAuthenticated) {
        // Redirect them safely to the dashboard, avoiding the broken logic.
        return { name: "Dashboard", replace: true };
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
