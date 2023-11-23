import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
const BASE_URL = "/dashboard";
/**
 * Pinia store to manage the UI state of dashboard view
 */
export const useDashboardStore = defineStore("dashboard", () => {
  const isSidebarOpen = ref(false);
  const isNavDropdownOpen = ref(false);

  const weatherInfo = ref<any>();

  /** Sets *isSidebarOpen* state to `true` */
  const openSidebar = () => (isSidebarOpen.value = true);

  /** Sets *isSidebarOpen* state to `false` */
  const closeSidebar = () => (isSidebarOpen.value = false);

  /** Toggles *isNavDropdownOpen* state */
  const toggleNavDropdown = () =>
    (isNavDropdownOpen.value = !isNavDropdownOpen.value);

  /** Sets *isNavDropdownOpen* state to `true` */
  const openNavDropdown = () => (isNavDropdownOpen.value = true);

  /** Sets *isNavDropdownOpen* state to `false` */
  const closeNavDropdown = () => (isNavDropdownOpen.value = false);

  /** Closes *profile dropdown* & *Sidebar* on mobile */
  const reset = () => {
    isSidebarOpen.value = false;
    isNavDropdownOpen.value = false;
  };

  /**
   * Fetches all the clients from backend API.
   * Stores them in `clients`.
   *
   */
  async function getDashboardInformation() {
    try {
      const response = await axios.get<IResponse<any>>(
          `${BASE_URL}`,
          { headers: authHeader() }
      );
      weatherInfo.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    isNavDropdownOpen,
    openNavDropdown,
    closeNavDropdown,
    toggleNavDropdown,
    reset,
    weatherInfo,
    getDashboardInformation,
  };
});
