import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IInvoice } from "@app-types/invoices";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { ISales } from "@/types/quotes";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("invoices");

/**
 * Pinia store to manage `invoices`
 */
export const useInvoicesStore = defineStore("invoices", () => {
  /** Array of fetched `invoices` objects */
  const invoices = ref<IInvoice[]>([]);

  /** Fetched `invoice` object */
  const invoice = ref<IInvoice>();

  /** Array of fetched `sales` objects */
  const sales = ref<ISales[]>([]);
  /**
   * Fetches all the invoices from backend API.
   * Stores them in `invoices`.
   */
  async function getAllInvoices() {
    try {
      const response = await axios.get<IResponse<IInvoice[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });

      invoices.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new invoice to the Database.
   *
   * @param {IInvoice} invoice - The Invoice object
   */
  const addInvoice = async (invoice: IInvoice) => {
    try {
      const response = await axios.post<IResponse<IInvoice>>(
        `${BASE_URL}`,
        invoice,
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
   * Fetches a single invoice details from backend API.
   * Stores it in `invoice`.
   *
   * @param {number} id - Invoice ID
   */
  async function getInvoice(id: number) {
    try {
      const response = await axios.post<IResponse<IInvoice>>(
        getUserTypeForRoute("showInvoices"),
        { id },
        { headers: authHeader() }
      );

      invoice.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Send invoice to client on email.
   *
   * @param {number} id - Invoice ID
   */
  async function sendInvoiceEmail(id: number) {
    try {
      const response = await axios.post<IResponse<IInvoice>>(
        getUserTypeForRoute("sendInvoiceEmail"),
        { id },
        { headers: authHeader() }
      );

      invoice.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing invoice properties.
   *
   * @param invoiceId
   * @param invoiceInfo
   */
  const updateInvoice = async (invoiceId: number, invoiceInfo: IInvoice) => {
    try {
      const response = await axios.post<IResponse<IInvoice>>(
        `${BASE_URL}/${invoiceId}`,
        invoiceInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a *invoicing* from the Database.
   * Also removes it from local state.
   *
   * @param {number} invoiceId - ID of the item to remove
   */
  const deleteInvoice = async (invoiceId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${invoiceId}`,
        { headers: authHeader() }
      );

      invoices.value = invoices.value.filter(
        (invoice) => invoice.id !== invoiceId
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  async function getAllSales() {
    try {
      const response = await axios.get<IResponse<ISales[]>>(
        getUserTypeForRoute(`salesPersons`),
        {
          headers: authHeader(),
        }
      );

      sales.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    invoices,
    invoice,
    sales,
    getInvoice,
    getAllInvoices,
    updateInvoice,
    addInvoice,
    sendInvoiceEmail,
    deleteInvoice,
    getAllSales,
  };
});
