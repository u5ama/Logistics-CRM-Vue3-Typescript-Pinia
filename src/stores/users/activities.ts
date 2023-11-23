import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserActivity } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("allActivities");

/**
 * Pinia store to manage *user history*
 */
export const useUserActivitiesStore = defineStore("user-activities", () => {
  /** Array of fetched `activity` objects */
  const activities = ref<IUserActivity[]>([]);

  /**
   * Fetches all the user activities from backend API.
   * Stores them in `activities`.
   *
   * @param {number} userId - ID of the user
   */
  async function getActivities(userId: number) {
    try {
      const response = await axios.get<IResponse<IUserActivity[]>>(
        `${BASE_URL}/${userId}`,
        { headers: authHeader() }
      );

      activities.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    activities,
    getActivities,
  };
});
