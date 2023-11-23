import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { IInvoice } from "@/types/invoices";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("getClientInvoices");

/**
 * Pinia store to manage client invoices
 */
export const useClientInvoicesStore = defineStore("client-invoices", () => {
  /** Array of *client `document`* objects */
  const invoices = ref<IInvoice[]>([]);

  /**
   * Fetches all the client invoices from backend API.
   * Stores them in `invoices`.
   *
   * @param {number} clientId - ID of the client
   */
  const getAllInvoices = async (clientId: number) => {
    try {
      const response = await axios.get<IResponse<IInvoice[]>>(
        `${BASE_URL}?client_id=${clientId}`,
        { headers: authHeader() }
      );

      invoices.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    invoices,
    getAllInvoices,
  };
});
