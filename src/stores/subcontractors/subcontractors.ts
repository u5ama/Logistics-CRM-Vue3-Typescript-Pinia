import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@/types/api";
import type { ISubcontractor } from "@/types/subcontractor";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("subcontractors");

/**
 * Pinia store to manage `subcontractors`
 */
export const useSubcontractorsStore = defineStore("subcontractors", () => {
  /** Array of fetched `subcontractor` objects */
  const subcontractors = ref<ISubcontractor[]>([]);
  const subcontractor = ref<ISubcontractor>();
  /**
   * Fetches all the subcontractors from backend API.
   * Stores them in `subcontractors`.
   *
   */
  async function getAllSubcontractors() {
    try {
      const response = await axios.get<IResponse<ISubcontractor[]>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      subcontractors.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Removes a subcontractor from the Database.
   * Also removes it from local state.
   *
   * @param {number} subcontractorId - ID of the subcontractor to remove
   */
  const deleteSubcontractor = async (subcontractorId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${subcontractorId}`,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      subcontractors.value = subcontractors.value.filter(
        (contractor) => contractor.id !== subcontractorId
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new subcontractor to the Database.
   *
   * @param {ISubcontractor} subcontractor - The subcontractor object
   */
  async function addSubcontractor(subcontractor: ISubcontractor) {
    try {
      const response = await axios.post<IResponse<ISubcontractor>>(
        `${BASE_URL}`,
        subcontractor,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      subcontractors.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single Subcontractor details from backend API.
   * Stores it in `Subcontractor`.
   *
   * @param {number} id - Subcontractor ID
   */
  async function getSubcontractor(id: number) {
    try {
      const response = await axios.post<IResponse<ISubcontractor>>(
        getUserTypeForRoute("showSubcontractor"),
        { id },
        { headers: authHeader() }
      );

      subcontractor.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }
  /**
   * Update an existing subcontractor properties.
   *
   * @param {number} subcontractorId - ID of the subcontractor to be updated
   * @param {ISubcontractor} subcontractorInfo - Subcontractor object with updated properties
   */
  async function updateSubcontractor(
    subcontractorId: number,
    subcontractorInfo: ISubcontractor
  ) {
    try {
      const response = await axios.post<IResponse<ISubcontractor>>(
        `${BASE_URL}/${subcontractorId}`,
        subcontractorInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      subcontractors.value = subcontractors.value.map((subcontractor) =>
        subcontractor.id === subcontractorId
          ? { ...response.data.data! }
          : subcontractor
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    subcontractor,
    subcontractors,
    getAllSubcontractors,
    updateSubcontractor,
    getSubcontractor,
    addSubcontractor,
    deleteSubcontractor,
  };
});
