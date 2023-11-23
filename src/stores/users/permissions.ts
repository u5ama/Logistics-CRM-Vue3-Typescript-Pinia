import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserPermission } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("permissions");

/**
 * Pinia store to manage user permissions
 */
export const useUserPermissionsStore = defineStore("user-permissions", () => {
  /** Array of `userPermission` objects */
  const permissions = ref<IUserPermission[]>([]);

  /**
   * Fetches all the permissions from backend API.
   * Stores them in `permissions`.
   *
   */
  const getAllPermissions = async () => {
    try {
      const response = await axios.get<IResponse<IUserPermission[]>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      permissions.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    permissions,
    getAllPermissions,
  };
});
