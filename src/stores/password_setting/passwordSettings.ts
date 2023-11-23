import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserPassword } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("changePassword");

/**
 * Pinia store to manage `invoice email settings`
 */
export const usePasswordSettingsStore = defineStore("passwordSettings", () => {
  /** Fetched `user password setting` object */
  const passwordSetting = ref<IUserPassword>();

  /**
   * Adds a new user password settings to the Database.
   *
   * @param {IUserPassword} passwordSetting - The Password Settings object
   */
  const addPasswordSetting = async (passwordSetting: IUserPassword) => {
    try {
      const response = await axios.post<IResponse<IUserPassword>>(
        `${BASE_URL}`,
        passwordSetting,
        {
          headers: authHeader(),
        }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    passwordSetting,
    addPasswordSetting,
  };
});
