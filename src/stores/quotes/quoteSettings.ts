import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IQuoteSettings } from "@app-types/quoteSettings";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";
const BASE_URL = getUserTypeForRoute("quoteSettings");

/**
 * Pinia store to manage `quote settings`
 */
export const useQuoteSettingsStore = defineStore("quoteSettings", () => {
  /** Array of fetched `quote settings` objects */
  const quoteSettings = ref<IQuoteSettings[]>([]);

  /** Fetched `quote setting` object */
  const quoteSetting = ref<IQuoteSettings>();
  /**
   * Fetches all the quote settings from backend API.
   * Stores them in `quote settings`.
   *
   */
  async function getAllQuoteSettings() {
    try {
      const response = await axios.get<IResponse<IQuoteSettings>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      quoteSetting.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new quote settings to the Database.
   *
   * @param {IQuoteSettings} quote - The Quote Settings object
   */
  const addQuoteSetting = async (quote: IQuoteSettings) => {
    try {
      const response = await axios.post<IResponse<IQuoteSettings>>(
        `${BASE_URL}`,
        quote,
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
   * Fetches a single quote details from backend API.
   * Stores it in `quote`.
   *
   * @param {number} id - quote ID
   */
  async function getQuoteSetting(id: number) {
    try {
      const response = await axios.post<IResponse<IQuoteSettings>>(
        getUserTypeForRoute("showQuoteSettings"),
        { id },
        { headers: authHeader() }
      );

      quoteSetting.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Send quote to client on email.
   *
   */
  async function sendQuoteSettingsEmail(quote: IQuoteSettings) {
    try {
      const response = await axios.post<IResponse<IQuoteSettings>>(
        getUserTypeForRoute("sendQuoteEmail"),
        quote,
        { headers: authHeader() }
      );

      quoteSetting.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    quoteSettings,
    quoteSetting,
    getQuoteSetting,
    getAllQuoteSettings,
    addQuoteSetting,
    sendQuoteSettingsEmail,
  };
});
