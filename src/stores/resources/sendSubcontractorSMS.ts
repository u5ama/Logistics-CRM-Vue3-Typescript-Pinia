import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { ISubcontractorSMS } from "@app-types/resources";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";
import type { ISubcontractor } from "@/types/subcontractor";

const BASE_URL = getUserTypeForRoute("assetSubcontractor");

/**
 * Pinia store to manage subcontractor bulk sms
 */
export const useSMSSubcontractorsStore = defineStore(
  "subcontractor-sms",
  () => {
    /** Array of *subcontractor sms`* objects */
    const messages = ref<ISubcontractorSMS[]>([]);
    const subcontractors = ref<ISubcontractor[]>([]);

    /**
     * Fetches all the user documents from backend API.
     * Stores them in `documents`.
     *
     * @param {number} assetId - ID of the user
     */
    const getAllSubcontractors = async (assetId: number) => {
      try {
        const response = await axios.get<IResponse<ISubcontractor[]>>(
          `${BASE_URL}?asset_id=${assetId}`,
          { headers: authHeader() }
        );

        subcontractors.value = [...response.data.data!];
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    async function sendSMSSubcontractors(message: Partial<ISubcontractorSMS>) {
      try {
        const formData = new FormData();

        for (const key in message) {
          if (Object.prototype.hasOwnProperty.call(message, key)) {
            const value = (message as Record<string, any>)[key];

            if (value) formData.append(key, value);
          }
        }

        const response = await axios.post<IResponse<ISubcontractorSMS>>(
          getUserTypeForRoute("sendSMS"),
          formData,
          { headers: authHeader() }
        );

        if (!response.data.success) throw response.data.message;

        messages.value.push(response.data.data!);
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    }

    return {
      messages,
      subcontractors,
      getAllSubcontractors,
      sendSMSSubcontractors,
    };
  }
);
