import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IAssetAttachment } from "@app-types/resources";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("attachments");

/**
 * Pinia store to manage `attachments`
 */
export const useAttachmentsStore = defineStore("attachments", () => {
  /** Array of fetched `attachment` objects */
  const attachments = ref<IAssetAttachment[]>([]);

  /** Fetched `attachment` object */
  const attachment = ref<IAssetAttachment>();

  /**
   * Fetches all the attachments from backend API.
   * Stores them in `attachments`.
   *
   */
  async function getAllAttachments() {
    try {
      const response = await axios.get<IResponse<IAssetAttachment[]>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      attachments.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single attachment details from backend API.
   * Stores it in `attachment`.
   *
   * @param {number} id - Attachment ID
   */
  async function getAttachment(id: number) {
    try {
      const response = await axios.post<IResponse<IAssetAttachment>>(
        getUserTypeForRoute("showAttachments"),
        { id },
        { headers: authHeader() }
      );

      attachment.value = { ...response.data.data! };
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new *asset attachment* to the database.
   * Pushes it to local state as well.
   *
   * @param {Partial<IAssetAttachment>} attachment - The attachment Object
   */
  async function addAttachment(attachment: Partial<IAssetAttachment>) {
    try {
      const response = await axios.post<IResponse<IAssetAttachment>>(
        `${BASE_URL}`,
        attachment,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      attachments.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing *resource attachment*.
   * Also updates the local state.
   *
   * @param {number} attachmentId - ID of the attachment to be updated
   * @param {IUserInfo} attachmentData - Attachment object with updated properties
   */
  async function updateAttachment(
    attachmentId: number,
    attachmentData: IAssetAttachment
  ) {
    try {
      const response = await axios.post<IResponse<IAssetAttachment>>(
        `${BASE_URL}/${attachmentId}`,
        attachmentData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      attachments.value = attachments.value.map((att) =>
        att.id === attachmentId ? response.data.data! : att
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Removes an attachment from the Database.
   * Also removes it from local state.
   *
   * @param {number} attachmentId - ID of the attachment to remove
   */
  async function deleteAttachment(attachmentId: number) {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${attachmentId}`,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      attachments.value = attachments.value.filter(
        (attachment) => attachment.id !== attachmentId
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    attachments,
    attachment,
    addAttachment,
    getAttachment,
    updateAttachment,
    getAllAttachments,
    deleteAttachment,
  };
});
