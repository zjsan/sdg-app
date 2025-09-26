import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./bootstrap";
import "../css/app.css";

import Home from "./pages/Home.vue";

const app = createApp(Home);
app.use(createPinia());
app.use(router);
app.mount("#app");
