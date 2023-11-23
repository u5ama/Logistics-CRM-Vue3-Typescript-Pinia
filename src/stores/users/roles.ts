import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserRole, RoleAndPermissions } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("roles");

/**
 * Pinia store to manage user roles
 */
export const useUserRolesStore = defineStore("user-roles", () => {
  /** Array of `userRole` objects */
  const roles = ref<IUserRole[]>([]);

  /**
   * Fetches all the user roles from backend API.
   * Stores them in `roles`.
   *
   */
  const getAllRoles = async () => {
    try {
      const response = await axios.get<IResponse<IUserRole[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });

      roles.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Get all the permissions for a specific role.
   *
   * @param {number} roleId - Role ID
   * @returns {RoleAndPermissions} RoleAndPermissions Object
   */
  const getRolePermissions = async (roleId: number) => {
    try {
      const response = await axios.post<IResponse<RoleAndPermissions>>(
        getUserTypeForRoute("showRoles"),
        { id: roleId },
        { headers: authHeader() }
      );

      return response.data.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Updates role permissions
   *
   * @param {number} roleId - The `id` of the user role
   * @param {string} name - The `new name for the role
   * @param {string[]} permissions - An array of permission strings
   */
  const updateRole = async (
    roleId: number,
    name: string,
    permissions: string[]
  ) => {
    try {
      const response = await axios.post<IResponse<undefined>>(
        `${BASE_URL}/${roleId}`,
        { name, permission: permissions },
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    roles,
    getAllRoles,
    getRolePermissions,
    updateRole,
  };
});
