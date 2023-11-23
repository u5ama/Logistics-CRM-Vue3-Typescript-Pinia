import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserTags } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";
import { UserTagType } from "@/types/user";

const BASE_URL = getUserTypeForRoute("userTags");

/**
 * Pinia store to manage user tags
 */
export const useUserTagsStore = defineStore("user-tags", () => {
  /** Array of *user `tags`* objects */
  const tags = ref<IUserTags[]>([]);
  const competencyTags = ref<IUserTags[]>([]);

  /** `boolean` to represent if the tags have been fetched from backend or not */
  const didFetchNotes = ref(false);

  /**
   * Fetches all the user tags from backend API.
   * Stores them in `tags`.
   *
   * @param {number} userId - ID of the user
   * @param {UserTagType} tagType - Type of the tags to fetch.
   */
  const getAllUserTags = async (userId: number, tagType: UserTagType) => {
    try {
      const response = await axios.get<IResponse<IUserTags[]>>(
        `${BASE_URL}?user_id=${userId}`,
        { headers: authHeader() }
      );

      const fetchedTags = [...response.data.data!];

      if (tagType === UserTagType.UserTag) tags.value = fetchedTags;
      else if (tagType === UserTagType.Competency)
        competencyTags.value = fetchedTags;
      didFetchNotes.value = true;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *user `tags`* to the database.
   * Pushes it to local `tags`.
   *
   * @param {number} user_id - ID of the user
   * @param {string} name - name for the new tag
   * @param {UserTagType} tagType - Type of the new tag
   */
  const addTag = async (
    user_id: number,
    name: string,
    tagType: UserTagType
  ) => {
    try {
      const response = await axios.post<IResponse<IUserTags>>(
        `${BASE_URL}`,
        { user_id, name, tag_type: tagType },
        { headers: authHeader() }
      );

      if (tagType === UserTagType.UserTag) tags.value.push(response.data.data!);
      else if (tagType === UserTagType.Competency)
        competencyTags.value.push(response.data.data!);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a *tag* from the Database.
   * Also removes it from local state.
   *
   * @param {number} tagId - ID of the note to remove
   */
  const deleteTag = async (tagId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${tagId}`,
        { headers: authHeader() }
      );

      tags.value = tags.value.filter((tag) => tag.id !== tagId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    tags,
    competencyTags,
    didFetchNotes,
    getAllUserTags,
    addTag,
    deleteTag,
  };
});
