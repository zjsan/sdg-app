import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./bootstrap";
import "../css/app.css";

import Login from "./pages/Login.vue";

const app = createApp(Login);
app.use(createPinia());
app.use(router);
app.mount("#app");
