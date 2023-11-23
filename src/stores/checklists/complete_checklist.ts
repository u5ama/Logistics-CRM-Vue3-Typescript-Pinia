import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IChecklist } from "@app-types/checklist";
import type { ICompleteChecklist } from "@app-types/completeChecklist";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("complete-checklist");

/**
 * Pinia store to manage `complete_checklist`
 */
export const useCompleteChecklistsStore = defineStore(
  "complete-checklist",
  () => {
    /** Fetched `checklist` object */
    const checklist = ref<IChecklist>();
    const error = ref<string | null>(null);
    /**
     * Fetches driver checklist from backend API.
     * Stores them in `suppliers`.
     *
     */
    const getDriverChecklist = async (id: number) => {
      try {
        const response = await axios.post<IResponse<IChecklist>>(
          `${BASE_URL}`,
          { id },
          { headers: authHeader() }
        );

        checklist.value = response.data.data!;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Complete checklist to the Database for driver.
     *
     */
    const addChecklist = async (
      selectedChecklist: any,
      checklistId: any,
      jobId: any
    ) => {
      try {
        const response = await axios.post<IResponse<ICompleteChecklist>>(
          `${BASE_URL}/save`,
          { selectedChecklist, checklistId, jobId },
          {
            headers: authHeader(),
          }
        );

        if (!response.data.success) throw response.data;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else if (typeof e === "string") error.value = e;
        else throw e;
      }
    };

    return {
      checklist,
      getDriverChecklist,
      addChecklist,
    };
  }
);
