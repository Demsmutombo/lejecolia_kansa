import { createApp } from "vue";
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import "./assets/css/sweetalert-custom.css";
import ArgonDashboard from "./argon-dashboard";

const pinia = createPinia();
const appInstance = createApp(App);

appInstance.use(pinia); // Pinia pour la gestion multi-rôle
appInstance.use(store); // Vuex existant (garde la compatibilité)
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");
