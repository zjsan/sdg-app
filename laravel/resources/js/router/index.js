import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import Developer from "../pages/Developer Page/Developer.vue";
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
        path: "/developer",
        name: "DeveloperPage",
        component: Developer,
        meta: { requiresAuth: true, role: "developer" }, // must be logged in
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

    //special cases when already login and trying to access auth routes
    // FIX: Prevent Power BI Fullscreen "Back" returning to Google OAuth URLs
    const blockedAuthPatterns = [/^\/auth\/google\/redirect$/i];

    if (blockedAuthPatterns.some((pattern) => pattern.test(to.path))) {
        console.warn("Blocked unintended Google OAuth redirect attempt.");

        if (auth.isAuthenticated) {
            return { name: "Dashboard", replace: true };
        }

        return { name: "Login", replace: true };
    }

    // Intercept the faulty callback navigation if the user is already authenticated
    if (to.path.startsWith("/auth/callback") && auth.isAuthenticated) {
        // Redirect them safely to the dashboard, avoiding the broken logic.
        return { name: "Dashboard", replace: true };
    }

    // SINGLE SESSION RESTORE POINT
    // If we have a token but haven't initialized the user yet, do it NOW.
    if (auth.token && !auth.initialized) {
        await auth.getUser();
    }

    // Redirect authenticated users away from Login
    if (to.meta.guestOnly && auth.isAuthenticated) {
        return { name: "Dashboard" };
    }

    // Protect routes that require auth
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: "Login" };
    }

    //  Handle Callback bypass
    if (to.path.startsWith("/auth/callback") && auth.isAuthenticated) {
        return { name: "Dashboard", replace: true };
    }

    //  Role-Based Access Control
    if (to.meta.role && auth.isAuthenticated) {
        const userRole = auth.user?.role?.slug;

        if (to.meta.role === "developer" && !auth.isDeveloper) {
            return { name: "NotAuthorized" };
        }

        if (to.meta.role === "admin" && !auth.isAdmin) {
            return { name: "NotAuthorized" };
        }
    }
});

export default router;
