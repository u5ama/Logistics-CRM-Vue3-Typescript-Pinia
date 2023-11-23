import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { IResourceSkill } from "@app-types/resources";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("skills");

/**
 * Pinia store to manage resource skills
 */
export const useResourceSkillsStore = defineStore("resource-skills", () => {
  /** Array of fetched `skill` objects */
  const skills = ref<IResourceSkill[]>([]);

  /**
   * Fetches all resource skills from backend API.
   * Stores them in `skills`.
   *
   */
  const getAllSkills = async () => {
    try {
      const response = await axios.get<IResponse<IResourceSkill[]>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      skills.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *resource skill* to the database.
   * Pushes it to local state as well.
   *
   * @param {string} name - Name of the new skill
   */
  const addNewSkill = async (name: string) => {
    try {
      const response = await axios.post<IResponse<IResourceSkill>>(
        `${BASE_URL}`,
        { name },
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      skills.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a skill from the Database.
   * Also removes it from local state.
   *
   * @param {number} skillId - ID of the skill to remove
   */
  const deleteSkill = async (skillId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${skillId}`,
        { headers: authHeader() }
      );

      skills.value = skills.value.filter((skill) => skill.id !== skillId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    skills,
    getAllSkills,
    addNewSkill,
    deleteSkill,
  };
});
