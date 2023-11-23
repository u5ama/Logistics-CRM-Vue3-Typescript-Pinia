import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import { getUserTypeForRoute } from "@utils/helpers";
import type { IAllocatedInvoice } from "@/types/invoices";

const BASE_URL = getUserTypeForRoute("allocatedInvoices");

/**
 * Pinia store to manage job documents
 */
export const useAllocatedInvoiceStore = defineStore("allocated-invoice", () => {
  /** Array of *user `document`* objects */
  const documents = ref<IAllocatedInvoice[]>([]);

  /**
   * Fetches all the job documents from backend API.
   * Stores them in `documents`.
   * @param {number} invoiceId - ID of the job
   */
  const getAllAllocatedInvoices = async (invoiceId: number) => {
    try {
      const response = await axios.get<IResponse<IAllocatedInvoice[]>>(
        `${BASE_URL}?invoiceId=${invoiceId}`,
        { headers: authHeader() }
      );

      documents.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *allocated invoice`* to the database.
   * Pushes it to local `invoice`.
   *
   * @param {number} invoiceId - ID of the invoice
   * @param {string} subcontractor_id - subcontractor_id for the subcontractor
   * @param {string} amount - amount for the invoice
   * @param {File} upload_file - the `File` object to be uploaded
   *
   * @return {boolean} - if the document was added successfully or not
   */
  const addAllocatedInvoice = async (
    invoiceId: number,
    subcontractor_id: string,
    amount: string,
    upload_file: File
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("invoice_id", invoiceId.toString());
      formData.append("subcontractor_id", subcontractor_id);
      formData.append("amount", amount);
      formData.append("upload_file", upload_file, upload_file.name);

      const response = await axios.post<IResponse<IAllocatedInvoice>>(
        `${BASE_URL}`,
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data.message;

      documents.value.push(response.data.data!);

      return true;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else useToast().error(e as string);

      return false;
    }
  };

  /**
   * Removes a *allocated invoice* from the Database.
   * Also removes it from local state.
   *
   * @param {number} documentId - ID of the document to remove
   */
  const deleteDocument = async (documentId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${documentId}`,
        { headers: authHeader() }
      );

      documents.value = documents.value.filter((doc) => doc.id !== documentId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    documents,
    getAllAllocatedInvoices,
    addAllocatedInvoice,
    deleteDocument,
  };
});
