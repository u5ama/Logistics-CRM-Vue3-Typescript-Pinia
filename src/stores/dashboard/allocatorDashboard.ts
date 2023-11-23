import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type {
  IDashboardAssets,
  IDashboardAssetsInUse,
} from "@app-types/dashboard";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("getDashboardDataAssets");
const BASE_URL_Second = getUserTypeForRoute("getDashboardAssetsInUse");

/**
 * Pinia store to manage `settings`
 */
export const useDashboardStore = defineStore("dashboard-data", () => {
  /** Array of fetched `assets data` objects */
  const dashboardAssets = ref<IDashboardAssets[]>([]);
  const assetsInUse = ref<IDashboardAssetsInUse[]>([]);

  /**
   * Fetches all the assets data from backend API.
   * Stores them in `assets data`.
   *
   */
  async function getAllDashboardAssets() {
    try {
      const response = await axios.get<IResponse<IDashboardAssets[]>>(
        `${BASE_URL}`,
        {
          headers: authHeader(),
        }
      );
      dashboardAssets.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  async function getAllAssetsInUse() {
    try {
      const response = await axios.get<IResponse<IDashboardAssetsInUse[]>>(
        `${BASE_URL_Second}`,
        {
          headers: authHeader(),
        }
      );
      assetsInUse.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    dashboardAssets,
    assetsInUse,
    getAllAssetsInUse,
    getAllDashboardAssets,
  };
});
