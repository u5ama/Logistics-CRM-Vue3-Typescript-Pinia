import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import type { ISubcontractorDriver } from "@/types/subcontractor";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("subcontractorDriver");

/**
 * Pinia store to manage subcontractor documents
 */
export const useSubcontractorDriversStore = defineStore(
  "subcontractor-drivers",
  () => {
    /** Array of *subcontractor `document`* objects */
    const drivers = ref<ISubcontractorDriver[]>([]);

    /**
     * Fetches all the subcontractor documents from backend API.
     * Stores them in `documents`.
     *
     * @param {number} subcontractorId - ID of the subcontractor
     */
    const getAllDrivers = async (subcontractorId: number) => {
      try {
        const response = await axios.get<IResponse<ISubcontractorDriver[]>>(
          `${BASE_URL}?subcontractor_id=${subcontractorId}`,
          { headers: authHeader() }
        );

        drivers.value = [...response.data.data!];
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
     * @param {number} user_id - title for the document
     *
     * @return {boolean} - if the document was added successfully or not
     */
    const addNewDriver = async (
      subcontractorId: number,
      user_id: number
    ): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append("subcontractor_id", subcontractorId.toString());
        formData.append("user_id", user_id.toString());

        const response = await axios.post<IResponse<ISubcontractorDriver>>(
          `${BASE_URL}`,
          formData,
          { headers: authHeader() }
        );

        if (!response.data.success) throw response.data.message;

        drivers.value.push(response.data.data!);

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
     * @param {number} driverId - ID of the document to remove
     */
    const deleteDriver = async (driverId: number) => {
      try {
        const response = await axios.delete<IResponse<undefined>>(
          `${BASE_URL}/${driverId}`,
          { headers: authHeader() }
        );

        drivers.value = drivers.value.filter((doc) => doc.id !== driverId);

        if (!response.data.success) throw response.data;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    return {
      drivers,
      getAllDrivers,
      addNewDriver,
      deleteDriver,
    };
  }
);
