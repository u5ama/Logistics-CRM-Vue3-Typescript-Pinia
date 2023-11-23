import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import type { ISupplierDocument } from "@/types/supplier";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("supplierDocument");

/**
 * Pinia store to manage supplier documents
 */
export const useSupplierDocumentsStore = defineStore(
  "supplier-documents",
  () => {
    /** Array of *supplier `document`* objects */
    const documents = ref<ISupplierDocument[]>([]);

    /**
     * Fetches all the supplier documents from backend API.
     * Stores them in `documents`.
     *
     * @param {number} supplierId - ID of the supplier
     */
    const getAllDocuments = async (supplierId: number) => {
      try {
        const response = await axios.get<IResponse<ISupplierDocument[]>>(
          `${BASE_URL}?supplier_id=${supplierId}`,
          { headers: authHeader() }
        );

        documents.value = [...response.data.data!];
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Adds a new *supplier `document`* to the database.
     * Pushes it to local `documents`.
     *
     * @param {number} supplierId - ID of the supplier
     * @param {string} title - title for the document
     * @param {File} upload_file - the `File` object to be uploaded
     *
     * @return {boolean} - if the document was added successfully or not
     */
    const addDocument = async (
      supplierId: number,
      title: string,
      upload_file: File
    ): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append("supplier_id", supplierId.toString());
        formData.append("title", title);
        formData.append("upload_file", upload_file, upload_file.name);

        const response = await axios.post<IResponse<ISupplierDocument>>(
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
     * Removes a *supplier document* from the Database.
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

        documents.value = documents.value.filter(
          (doc) => doc.id !== documentId
        );

        if (!response.data.success) throw response.data;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    return {
      documents,
      getAllDocuments,
      addDocument,
      deleteDocument,
    };
  }
);
