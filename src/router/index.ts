import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@stores/auth";
import { dashboardRoutes, DashboardRouteNames } from "./routes/dashboardRoutes";

// Create the router instance
const router = createRouter({
  // Define scroll behavior for navigation
  scrollBehavior(to, from) {
    if (from.path === to.path) return;
    return { top: 0 };
  },
  // Set the history mode and base URL for the router
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define the routes for the router
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "dashboard",
    },
    dashboardRoutes, // Import the routes for the dashboard
    {
      path: "/login",
      name: "login",
      component: () => import("@views/LoginView.vue"), // Asynchronously load the LoginView component
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@views/SignupView.vue"), // Asynchronously load the SignupView component
    },
  ],
});

// Define a navigation guard that runs before each route navigation
router.beforeEach(async (to) => {
  const publicPages = ["/login", "/signup"]; // Pages accessible without authentication
  const authPages = ["/login", "/signup"]; // Pages accessible only when not authenticated

  const pathRequiresAuth = !publicPages.includes(to.path); // Check if the destination path requires authentication
  const pathRequiresNoAuth = authPages.includes(to.path); // Check if the destination path requires no authentication
  const { isAuthenticated } = storeToRefs(useAuthStore()); // Get the authentication status from the store

  // Redirect to the login page if authentication is required but the user is not authenticated
  if (pathRequiresAuth && !isAuthenticated.value) return "/login";
  // Redirect to the homepage if authentication is not required but the user is authenticated
  if (pathRequiresNoAuth && isAuthenticated.value) return "/";
});

export default router; // Export the router instance

export { DashboardRouteNames }; // Export the DashboardRouteNames constant
