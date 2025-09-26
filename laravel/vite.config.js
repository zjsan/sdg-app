import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.js"],
            refresh: true,
        }),
        tailwindcss(),
        vue(),
    ],
    server: {
        // MUST be 0.0.0.0 to listen on all interfaces inside the container
        host: "0.0.0.0",
        port: 5173,

        // CRITICAL: Tells the browser to connect to 'localhost', not [::]
        hmr: {
            host: "localhost",
        },
    },
});
