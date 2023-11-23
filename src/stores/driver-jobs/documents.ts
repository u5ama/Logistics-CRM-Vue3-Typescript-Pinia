import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import type { IDriverJobDocument } from "@/types/jobs";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("jobDocument");

/**
 * Pinia store to manage job documents
 */
export const useJobDocumentsStore = defineStore("job-documents", () => {
  /** Array of *user `document`* objects */
  const documents = ref<IDriverJobDocument[]>([]);

  /**
   * Fetches all the job documents from backend API.
   * Stores them in `documents`.
   *
   * @param {number} userId - ID of the job
   */
  const getAllDocuments = async (userId: number) => {
    try {
      const response = await axios.get<IResponse<IDriverJobDocument[]>>(
        `${BASE_URL}?job_id=${userId}`,
        { headers: authHeader() }
      );

      documents.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Fetches all the job documents from backend API.
   * Stores them in `documents`.
   *
   * @param {number} userId - ID of the job
   */
  const DriverAllDocuments = async (userId: number) => {
    try {
      const response = await axios.get<IResponse<IDriverJobDocument[]>>(
        getUserTypeForRoute(`AllJobDocument?driver_id=${userId}`),
        { headers: authHeader() }
      );

      documents.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *job `document`* to the database.
   * Pushes it to local `documents`.
   *
   * @param {number} job_id - ID of the job
   * @param {string} title - title for the document
   * @param {string} hire_docket - hire_docket for the document
   * @param {string} cameraImage - cameraImage for the document
   * @param {File} upload_file - the `File` object to be uploaded
   *
   * @return {boolean} - if the document was added successfully or not
   */
  const addDocument = async (
    job_id: number,
    title: string,
    hire_docket: string,
    cameraImage: string,
    upload_file: File
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("job_id", job_id.toString());
      formData.append("title", title);
      formData.append("hire_docket", hire_docket);
      formData.append("manual_image", cameraImage);
      if (upload_file) {
        formData.append("upload_file", upload_file, upload_file.name);
      }
      const response = await axios.post<IResponse<IDriverJobDocument>>(
        `${BASE_URL}`,
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data.message;

      documents.value.push(response.data.data!);

      return true;
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else useToast().error(e as string);

      return false;
    }
  };

  /**
   * Removes a *job document* from the Database.
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
    DriverAllDocuments,
    addDocument,
    deleteDocument,
  };
});
