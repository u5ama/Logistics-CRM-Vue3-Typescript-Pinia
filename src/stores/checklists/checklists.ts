import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IChecklist } from "@app-types/checklist";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("checklist");

/**
 * Pinia store to manage `checklist`
 */
export const useChecklistsStore = defineStore("checklist", () => {
  /** Array of fetched `checklists` objects */
  const checklists = ref<IChecklist[]>([]);

  /** Fetched `checklist` object */
  const checklist = ref<IChecklist>();

  /**
   * Fetches all the checklists from backend API.
   * Stores them in `checklists`.
   *
   */
  async function getAllChecklists() {
    try {
      const response = await axios.get<IResponse<IChecklist[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });

      checklists.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new checklist to the Database.
   *
   * @param {IChecklist} checklist - The checklist object
   */
  const addChecklist = async (checklist: IChecklist) => {
    try {
      const response = await axios.post<IResponse<IChecklist>>(
        `${BASE_URL}`,
        checklist,
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

  /**
   * Update an existing checklist properties.
   *
   * @param checklistId
   * @param checklistInfo
   */
  const updateChecklist = async (
    checklistId: number,
    checklistInfo: IChecklist
  ) => {
    try {
      const response = await axios.post<IResponse<IChecklist>>(
        `${BASE_URL}/${checklistId}`,
        checklistInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    checklists,
    checklist,
    getChecklist,
    getAllChecklists,
    updateChecklist,
    addChecklist,
  };
});
