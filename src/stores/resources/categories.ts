import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { IResourceCategory } from "@app-types/resources";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("resourceCategory");

/**
 * Pinia store to manage resource skills
 */
export const useResourceCategoriesStore = defineStore(
  "resource-categories",
  () => {
    /** Array of fetched `skill` objects */
    const categories = ref<IResourceCategory[]>([]);

    /**
     * Fetches all resource skills from backend API.
     * Stores them in `skills`.
     *
     */
    const getAllCategories = async () => {
      try {
        const response = await axios.get<IResponse<IResourceCategory[]>>(
          `${BASE_URL}`,
          { headers: authHeader() }
        );

        categories.value = [...response.data.data!];
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Adds a new *resource category* to the database.
     * Pushes it to local state as well.
     *
     * @param {string} name - Name of the new skill
     */
    const addNewCategory = async (name: string) => {
      try {
        const response = await axios.post<IResponse<IResourceCategory>>(
          `${BASE_URL}`,
          { name },
          { headers: authHeader() }
        );

        if (!response.data.success) throw response.data;

        categories.value.push(response.data.data!);
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Removes a skill from the Database.
     * Also removes it from local state.
     *
     * @param {number} categoryId - ID of the skill to remove
     */
    const deleteCategory = async (categoryId: number) => {
      try {
        const response = await axios.delete<IResponse<undefined>>(
          `${BASE_URL}/${categoryId}`,
          { headers: authHeader() }
        );

        categories.value = categories.value.filter(
          (category) => category.id !== categoryId
        );

        if (!response.data.success) throw response.data;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    return {
      categories,
      getAllCategories,
      addNewCategory,
      deleteCategory,
    };
  }
);
