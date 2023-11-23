<script setup lang="ts">
import axios from "axios";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@stores/auth";
import "@assets/base.scss";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-orange/theme.css";
import "primeicons/primeicons.css";
import "@assets/main.scss";

// Set the base URL for Axios requests using the VITE_API_URL environment variable
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Set the Access-Control-Allow-Origin header for all requests
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

// Access the authentication store using the useAuthStore hook from the @stores/auth module
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <header class="flex py-4 px-6" v-if="!isAuthenticated">
    <nav class="flex items-center gap-x-4 ml-16 w-full"></nav>
  </header>
  <RouterView />
</template>

<style scoped></style>
