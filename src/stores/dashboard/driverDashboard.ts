import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type {
  IDashboardAllocatedJobs,
} from "@app-types/dashboard";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL_Driver = getUserTypeForRoute("getDriverAllocatedJobs");

/**
 * Pinia store to manage `settings`
 */
export const useDriverDashboardStore = defineStore("dashboard-data", () => {
  const allocatedJobs = ref<IDashboardAllocatedJobs[]>([]);

  /**
   * Fetches all the driver jobs from backend API.
   * Stores them in `driver jobs`.
   *
   */

  async function getAllDashboardDriverJobs() {
    try {
      const response = await axios.get<IResponse<IDashboardAllocatedJobs[]>>(
        `${BASE_URL_Driver}`,
        {
          headers: authHeader(),
        }
      );
      allocatedJobs.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    allocatedJobs,
    getAllDashboardDriverJobs,
  };
});
