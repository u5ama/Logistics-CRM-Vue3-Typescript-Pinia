import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { ILog } from "@app-types/logs";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("allLogs");

/**
 * Pinia store to manage `logs`
 */
export const useLogsStore = defineStore("logs", () => {
  /** Array of `log` objects */
  const logs = ref<ILog[]>([]);

  /**
   * Fetches all the logs from backend API.
   *
   */
  async function getAllLogs() {
    try {
      const response = await axios.get<IResponse<ILog[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });

      logs.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return { logs, getAllLogs };
});
