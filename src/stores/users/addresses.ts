import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserAddress } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("addresses");

/**
 * Pinia store to manage *user addresses*
 */
export const useUserAddressesStore = defineStore("user-addresses", () => {
  /** Array of fetched `address` objects */
  const addresses = ref<IUserAddress[]>([]);

  /**
   * Fetches all the user addresses from backend API.
   * Stores them in `addresses`.
   *
   * @param {number} userId - ID of the user
   */
  async function getAddresses(userId: number) {
    try {
      const response = await axios.get<IResponse<IUserAddress[]>>(
        `${BASE_URL}?user_id=${userId}`,
        { headers: authHeader() }
      );

      addresses.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new *user address* to the database.
   * Pushes it to local `addresses`.
   *
   * @param {number} userId - ID of the user
   * @param {string} address - Address to add
   */
  const addAddress = async (userId: number, address: string) => {
    try {
      const response = await axios.post<IResponse<IUserAddress>>(
        `${BASE_URL}`,
        { user_id: userId, address },
        {
          headers: authHeader(),
        }
      );

      addresses.value.push(response.data.data!);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes an address from the Database.
   * Also removes it from local state.
   *
   * @param {number} addressId - ID of the address to remove
   */
  const deleteAddress = async (addressId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${addressId}`,
        {
          headers: authHeader(),
        }
      );

      addresses.value = addresses.value.filter((addr) => addr.id !== addressId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Updates an address in the Database.
   * Also updates it in local state.
   *
   * @param {number} addressId - ID of the address to update
   * @param {string} address - New address value
   * @param {number} userId - Id of the new belonging user
   */
  const updateAddress = async (
    addressId: number,
    address: string,
    userId: number
  ) => {
    try {
      const response = await axios.post<IResponse<IUserAddress>>(
        `${BASE_URL}/${addressId}`,
        { user_id: userId, address },
        {
          headers: authHeader(),
        }
      );

      addresses.value = addresses.value.map((addr) => {
        if (addr.id === addressId) {
          addr.address = address;
          addr.user_id = userId;
        }

        return addr;
      });

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    addresses,
    getAddresses,
    addAddress,
    deleteAddress,
    updateAddress,
  };
});
