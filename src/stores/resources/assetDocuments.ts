import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IAssetDocument } from "@app-types/resources";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("assetDocuments");

/**
 * Pinia store to manage user documents
 */
export const useAssetDocumentsStore = defineStore(
  "attachment-documents",
  () => {
    /** Array of *user `document`* objects */
    const documents = ref<IAssetDocument[]>([]);

    /**
     * Fetches all the user documents from backend API.
     * Stores them in `documents`.
     *
     * @param {number} assetId - ID of the user
     */
    const getAllDocuments = async (assetId: number) => {
      try {
        const response = await axios.get<IResponse<IAssetDocument[]>>(
          `${BASE_URL}?asset_id=${assetId}`,
          { headers: authHeader() }
        );

        documents.value = [...response.data.data!];
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Adds a new *user `document`* to the database.
     * Pushes it to local `documents`.
     *
     * @param {number} asset_id - ID of the Asset
     * @param {string} title - title for the document
     * @param {string} expiry
     * @param {string} alert
     * @param {File} upload_file - the `File` object to be uploaded
     *
     * @return {boolean} - if the document was added successfully or not
     */
    const addDocument = async (
      asset_id: number,
      title: string,
      expiry: string,
      alert: string,
      upload_file: File
    ): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append("asset_id", asset_id.toString());
        formData.append("title", title);
        formData.append("expiry", expiry);
        formData.append("alert", alert);
        formData.append("upload_file", upload_file, upload_file.name);

        const response = await axios.post<IResponse<IAssetDocument>>(
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
     * Removes a *assetDocument* from the Database.
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
