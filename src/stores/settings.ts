import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { ISettings } from "@app-types/settings";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("getSettings");

/**
 * Pinia store to manage `settings`
 */
export const useSettingStore = defineStore("settings", () => {
  /** Array of fetched `settings` objects */
  const settings = ref<ISettings>();

  /**
   * Fetches all the settings from backend API.
   * Stores them in `settings`.
   *
   */
  async function getAllSettings() {
    try {
      const response = await axios.get<IResponse<ISettings>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );
      settings.value = response.data.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Disconnects MYOB from the Database.
   * Also removes it from local state.
   *
   */
  const deleteSettings = async () => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/1`,
        { headers: authHeader() }
      );
      if (!response.data.success) throw response.data;
      settings.value = response.data.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    settings,
    getAllSettings,
    deleteSettings,
  };
});
