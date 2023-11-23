import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IDashboardSafety } from "@app-types/dashboard";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("getSafetyOfficerDash");

/**
 * Pinia store to manage `settings`
 */
export const useSafetyDashboardStore = defineStore("dashboard-data", () => {
  /** Array of fetched `assets data` objects */
  const dashboardSafety = ref<IDashboardSafety>();
  async function getAllSafetyOfficerData() {
    try {
      const response = await axios.get<IResponse<IDashboardSafety>>(
        `${BASE_URL}`,
        {
          headers: authHeader(),
        }
      );
      dashboardSafety.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    dashboardSafety,
    getAllSafetyOfficerData,
  };
});
