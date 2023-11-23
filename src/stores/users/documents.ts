import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserDocument } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("documents");

/**
 * Pinia store to manage user documents
 */
export const useUserDocumentsStore = defineStore("user-documents", () => {
  /** Array of *user `document`* objects */
  const documents = ref<IUserDocument[]>([]);

  /**
   * Fetches all the user documents from backend API.
   * Stores them in `documents`.
   *
   * @param {number} userId - ID of the user
   */
  const getAllDocuments = async (userId: number) => {
    try {
      const response = await axios.get<IResponse<IUserDocument[]>>(
        `${BASE_URL}?user_id=${userId}`,
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
   * @param {number} user_id - ID of the user
   * @param {string} title - title for the document
   * @param {string} document_type - type for the document
   * @param {File} upload_file - the `File` object to be uploaded
   *
   * @return {boolean} - if the document was added successfully or not
   */
  const addDocument = async (
    user_id: number,
    title: string,
    document_type: string,
    upload_file: File
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("user_id", user_id.toString());
      formData.append("title", title);
      formData.append("document_type", document_type);
      formData.append("upload_file", upload_file, upload_file.name);

      const response = await axios.post<IResponse<IUserDocument>>(
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
   * Removes a *document* from the Database.
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
    getAllDocuments,
    addDocument,
    deleteDocument,
  };
});
