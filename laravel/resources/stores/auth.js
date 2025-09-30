import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,      // stores logged-in user object
    loading: false,  // tracks async requests
    error: null,     // for error handling
  }),
    getters: {
        isAuthenticated: (state) => !!state.user,
    }),

    actions: {
        /**
     * Fetch CSRF cookie (required before login).
     * Laravel sets `XSRF-TOKEN` and session cookie here.
     */
   
    async getCsrfCookie() {
         try {
              await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
        
    } catch (error) {
        
    }
    
    },
    }