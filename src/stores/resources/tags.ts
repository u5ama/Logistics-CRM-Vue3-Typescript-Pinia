import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { ResourceTagType, type IResourceTag } from "@app-types/resources";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("tags");

/**
 * Pinia store to manage resource tags
 */
export const useResourceTagsStore = defineStore("resource-tags", () => {
  /** Array of `tags` of type 'tags' */
  const attachmentTags = ref<IResourceTag[]>([]);

  /** Array of `tags` of type 'asset' */
  const assetTags = ref<IResourceTag[]>([]);
  const competencyTags = ref<IResourceTag[]>([]);
  const resourceTags = ref<IResourceTag[]>([]);

  /**
   * Fetches all the resource tags of given type from backend API.
   *
   * @param {ResourceTagType} tagType - Type of the tags to fetch.
   */
  const getAllTags = async (tagType: ResourceTagType) => {
    try {
      const response = await axios.get<IResponse<IResourceTag[]>>(
        `${BASE_URL}?tag_type=${tagType}`,
        { headers: authHeader() }
      );

      const fetchedTags = [...response.data.data!];

      if (tagType === ResourceTagType.Attachment)
        attachmentTags.value = fetchedTags;
      else if (tagType === ResourceTagType.Asset) assetTags.value = fetchedTags;
      else if (tagType === ResourceTagType.Competency)
        competencyTags.value = fetchedTags;
      else if (tagType === ResourceTagType.Resource)
        resourceTags.value = fetchedTags;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *resource tag* to the database.
   * Pushes it to local state as well.
   *
   * @param {string} name - Name of the new tag
   * @param {ResourceTagType} tagType - Type of the new tag
   */
  const addNewTag = async (name: string, tagType: ResourceTagType) => {
    try {
      const response = await axios.post<IResponse<IResourceTag>>(
        `${BASE_URL}`,
        { name, tag_type: tagType },
        { headers: authHeader() }
      );

      if (tagType === ResourceTagType.Attachment)
        attachmentTags.value.push(response.data.data!);
      else if (tagType === ResourceTagType.Asset)
        assetTags.value.push(response.data.data!);
      else if (tagType === ResourceTagType.Competency)
        competencyTags.value.push(response.data.data!);
      else if (tagType === ResourceTagType.Resource)
        resourceTags.value.push(response.data.data!);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a tag from the Database.
   * Also removes it from local state.
   *
   * @param {number} tagId - ID of the tag to remove
   */
  const deleteTag = async (tagId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${tagId}`,
        { headers: authHeader() }
      );

      attachmentTags.value = attachmentTags.value.filter(
        (tag) => tag.id !== tagId
      );
      assetTags.value = assetTags.value.filter((tag) => tag.id !== tagId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    attachmentTags,
    assetTags,
    competencyTags,
    resourceTags,
    getAllTags,
    addNewTag,
    deleteTag,
  };
});
