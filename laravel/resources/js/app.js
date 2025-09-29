import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./bootstrap";
import "../css/app.css";

import App from "./pages/App.vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
