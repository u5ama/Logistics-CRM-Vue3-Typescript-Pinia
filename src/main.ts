import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import App from "@/App.vue";
import router from "@router";
import "vue-toastification/dist/index.css";
import toastOptions from "@utils/toastOptions";
// @ts-ignore
import CKEditor from "@ckeditor/ckeditor5-vue";
import VueGoogleMaps from "@fawmi/vue-google-maps";

// Create the Vue app instance
const app = createApp(App);

// Use Pinia for state management
app.use(createPinia());

// Use the router for navigation
app.use(router);

// Use the CKEditor plugin
app.use(CKEditor);

// Use PrimeVue for UI components
app.use(PrimeVue);

// Register the "tooltip" directive from PrimeVue
app.directive("tooltip", Tooltip);

// Use Vue Toastification for toast notifications
app.use(Toast, toastOptions);

// Use Vue Google Maps
app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAWffdTXN5jXqGmtTBGux9iDExUZruepUI",
    libraries: "places",
    // language: 'de',
  },
});

// Mount the app to the DOM element with id "app"
app.mount("#app");
