import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IEmailTemplateSettings } from "@app-types/emailTemplateSettings";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";
const BASE_URL = getUserTypeForRoute("emailSettings");

/**
 * Pinia store to manage `invoice email settings`
 */
export const useEmailSettingsStore = defineStore("emailSettings", () => {
  /** Array of fetched `invoice email settings` objects */
  const emailSettings = ref<IEmailTemplateSettings[]>([]);

  /** Fetched `invoice email setting` object */
  const emailSetting = ref<IEmailTemplateSettings>();
  /**
   * Fetches all the invoice email settings from backend API.
   * Stores them in `invoice email settings`.
   *
   */
  async function getAllEmailSettings() {
    try {
      const response = await axios.get<IResponse<IEmailTemplateSettings>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      emailSetting.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new invoice email settings to the Database.
   *
   * @param {IEmailTemplateSettings} emailSetting - The Email Settings object
   */
  const addEmailSetting = async (emailSetting: IEmailTemplateSettings) => {
    try {
      const response = await axios.post<IResponse<IEmailTemplateSettings>>(
        `${BASE_URL}`,
        emailSetting,
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

  /**
   * Fetches a single email details from backend API.
   * Stores it in `emailSetting`.
   *
   * @param {number} id - emailSetting ID
   */
  async function getEmailSetting(id: number) {
    try {
      const response = await axios.post<IResponse<IEmailTemplateSettings>>(
        getUserTypeForRoute("showEmailSettings"),
        { id },
        { headers: authHeader() }
      );

      emailSetting.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    emailSettings,
    emailSetting,
    getEmailSetting,
    getAllEmailSettings,
    addEmailSetting,
  };
});
