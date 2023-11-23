import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { ISettings } from "@app-types/settings";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("getDocusignSettings");

/**
 * Pinia store to manage `Docusign Settings`
 */
export const useDocusignSettingStore = defineStore("docusignSettings", () => {
  /** Array of fetched `Docusign Settings` objects */
  const docusignSettings = ref<ISettings>();

  /**
   * Fetches all the Docusign settings from backend API.
   * Stores them in `Docusign settings`.
   *
   */
  async function getDocusignSettings() {
    try {
      const response = await axios.get<IResponse<ISettings>>(`${BASE_URL}`, {
        headers: authHeader(),
      });
      docusignSettings.value = response.data.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Disconnects Docusign from the Database.
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
      docusignSettings.value = response.data.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  async function uploadDocument(pdf: string, email: string) {
    try {
      const response = await axios.post<IResponse<undefined>>(getUserTypeForRoute(`uploadDocument`),
        { pdf, email, },
        { headers: authHeader()
        });

      if (!response.data.success) throw response.data.message;

      const userValue = response.data.data;

    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    docusignSettings,
    getDocusignSettings,
    deleteSettings,
  };
});
