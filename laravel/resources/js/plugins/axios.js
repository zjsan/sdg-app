import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
    baseURL: "http://localhost:8080", // Laravel API base
    withCredentials: true, // important for Sanctum cookies
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
});

export default api;
