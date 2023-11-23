import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IAttachmentDocument } from "@app-types/resources";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("attachmentDocuments");

/**
 * Pinia store to manage attachment documents
 */
export const useAttachmentDocumentsStore = defineStore(
  "attachment-documents",
  () => {
    /** Array of *attachment `document`* objects */
    const documents = ref<IAttachmentDocument[]>([]);

    /**
     * Fetches all the attachment documents from backend API.
     * Stores them in `attachment document`.
     *
     * @param {number} attachmentId - ID of the attachment
     */
    const getAllDocuments = async (attachmentId: number) => {
      try {
        const response = await axios.get<IResponse<IAttachmentDocument[]>>(
          `${BASE_URL}?attachment_id=${attachmentId}`,
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
     * @param {number} attachment_id - ID of the Asset
     * @param {string} title - title for the document
     * @param {string} expiry - expiry for the document
     * @param {string} alert - alert for the document
     * @param {File} upload_file - the `File` object to be uploaded
     *
     * @return {boolean} - if the document was added successfully or not
     */
    const addDocument = async (
      attachment_id: number,
      title: string,
      expiry: string,
      alert: string,
      upload_file: File
    ): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append("attachment_id", attachment_id.toString());
        formData.append("title", title);
        formData.append("expiry", expiry);
        formData.append("alert", alert);
        formData.append("upload_file", upload_file, upload_file.name);

        const response = await axios.post<IResponse<IAttachmentDocument>>(
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
     * Removes a *attachmentDocument* from the Database.
     * Also removes it from local state.
     *
     * @param {number} documentId - ID of the attachment document to remove
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
