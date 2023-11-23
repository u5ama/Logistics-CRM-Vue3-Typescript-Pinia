import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IChecklist, IDriverChecklist } from "@app-types/checklist";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("driver-checklist");

/**
 * Pinia store to manage `drivers_checklists`
 */
export const useDriversChecklistsStore = defineStore("driver-checklist", () => {
  /** Fetched `checklist` object */
  const driverChecklist = ref<IDriverChecklist[]>([]);
  const singleChecklist = ref<IDriverChecklist>();
  const checklist = ref<IChecklist>();

  /**
   * Fetches driver checklist from backend API.
   * Stores them in `drivers_checklists`.
   *
   */
  const getDriverChecklist = async (id: number, driverId: number) => {
    try {
      const response = await axios.post<IResponse<IDriverChecklist[]>>(
        `${BASE_URL}`,
        { id, driverId },
        { headers: authHeader() }
      );

      driverChecklist.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  const getDriverSingleChecklist = async (id: number) => {
    try {
      const response = await axios.post<IResponse<IDriverChecklist>>(
        getUserTypeForRoute(`singleChecklist`),
        { id },
        { headers: authHeader() }
      );

      singleChecklist.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Fetches a single checklist details from backend API.
   * Stores it in `checklist`.
   *
   * @param {number} id - Checklist ID
   */
  async function getChecklist(id: number) {
    try {
      const response = await axios.post<IResponse<IChecklist>>(
        getUserTypeForRoute("showChecklist"),
        { id },
        { headers: authHeader() }
      );

      checklist.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  const getDriverChecklistDetail = async (id: number) => {
    try {
      const response = await axios.post<IResponse<IChecklist>>(
        getUserTypeForRoute(`driverChecklist`),
        { id },
        { headers: authHeader() }
      );

      checklist.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    singleChecklist,
    driverChecklist,
    checklist,
    getDriverChecklist,
    getDriverChecklistDetail,
    getDriverSingleChecklist,
    getChecklist,
  };
});
