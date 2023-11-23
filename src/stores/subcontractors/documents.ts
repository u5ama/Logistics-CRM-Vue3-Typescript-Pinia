import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import type { ISubcontractorDocument } from "@/types/subcontractor";
import { getUserTypeForRoute } from "@utils/helpers";
import type { DocumentStatus } from "@/types/subcontractor";

const BASE_URL = getUserTypeForRoute("subcontractorDocuments");

/**
 * Pinia store to manage subcontractor documents
 */
export const useSubcontractorDocumentsStore = defineStore(
  "subcontractor-documents",
  () => {
    /** Array of *subcontractor `document`* objects */
    const documents = ref<ISubcontractorDocument[]>([]);

    /**
     * Fetches all the subcontractor documents from backend API.
     * Stores them in `documents`.
     *
     * @param {number} subcontractorId - ID of the subcontractor
     */
    const getAllDocuments = async (subcontractorId: number) => {
      try {
        const response = await axios.get<IResponse<ISubcontractorDocument[]>>(
          `${BASE_URL}?subcontractor_id=${subcontractorId}`,
          { headers: authHeader() }
        );

        documents.value = [...response.data.data!];
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Adds a new *subcontractor `document`* to the database.
     * Pushes it to local `documents`.
     *
     * @param {number} subcontractorId - ID of the subcontractor
     * @param {string} title - title for the document
     * @param reminder
     * @param {File} upload_file - the `File` object to be uploaded
     *
     * @return {boolean} - if the document was added successfully or not
     */
    const addDocument = async (
      subcontractorId: number,
      title: string,
      reminder: string,
      upload_file: File
    ): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append("subcontractor_id", subcontractorId.toString());
        formData.append("title", title);
        formData.append("reminder", reminder);
        formData.append("upload_file", upload_file, upload_file.name);

        const response = await axios.post<IResponse<ISubcontractorDocument>>(
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
     * Removes a *subcontractor document* from the Database.
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

    /**
     * Fetches all the subcontractor documents from backend API.
     * Stores them in `documents`.
     *
     * @param {number} documentId - ID of the document
     * @param newStatus
     */
    const changeDocumentStatus = async (documentId: number,  newStatus: DocumentStatus) => {
      try {
        const response = await axios.post<IResponse<ISubcontractorDocument>>(
          getUserTypeForRoute("changeDocumentStatus") + "/" + documentId,
          { status: newStatus },
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
    return {
      documents,
      getAllDocuments,
      addDocument,
      deleteDocument,
      changeDocumentStatus,
    };
  }
);
