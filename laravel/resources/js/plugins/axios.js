import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Laravel API base
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Automatically attach token if present
const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
