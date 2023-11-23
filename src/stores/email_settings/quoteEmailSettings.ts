import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IQuoteEmailTemplateSettings } from "@app-types/quoteEmailTemplateSettings";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";
const BASE_URL = getUserTypeForRoute("quoteEmailTemplate");

/**
 * Pinia store to manage `quote email settings`
 */
export const useQuoteEmailSettingsStore = defineStore(
  "quoteEmailSettings",
  () => {
    /** Array of fetched `quote email settings` objects */
    const quoteEmailSettings = ref<IQuoteEmailTemplateSettings[]>([]);

    /** Fetched `quote email setting` object */
    const quoteEmailSetting = ref<IQuoteEmailTemplateSettings>();
    /**
     * Fetches all the quote email settings from backend API.
     * Stores them in `quote email settings`.
     *
     */
    async function getAllEmailSettings() {
      try {
        const response = await axios.get<
          IResponse<IQuoteEmailTemplateSettings>
        >(`${BASE_URL}`, { headers: authHeader() });

        quoteEmailSetting.value = response.data.data!;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    }

    /**
     * Adds a new quote email settings to the Database.
     *
     * @param {IQuoteEmailTemplateSettings} quoteEmailSettingParam - The Email Settings object
     */
    const addEmailSetting = async (
      quoteEmailSettingParam: IQuoteEmailTemplateSettings
    ) => {
      try {
        const response = await axios.post<
          IResponse<IQuoteEmailTemplateSettings>
        >(`${BASE_URL}`, quoteEmailSettingParam, {
          headers: authHeader(),
        });

        if (!response.data.success) throw response.data;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Fetches a single quote email details from backend API.
     * Stores it in `emailSetting`.
     *
     * @param {number} id - emailSetting ID
     */
    async function getEmailSetting(id: number) {
      try {
        const response = await axios.post<
          IResponse<IQuoteEmailTemplateSettings>
        >(
          getUserTypeForRoute("showEmailSettings"),
          { id },
          { headers: authHeader() }
        );

        quoteEmailSetting.value = response.data.data!;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    }

    return {
      quoteEmailSettings,
      quoteEmailSetting,
      getEmailSetting,
      getAllEmailSettings,
      addEmailSetting,
    };
  }
);
