import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@/types/api";
import type { IDriver } from "@/types/drivers";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("drivers");

/**
 * Pinia store to manage `drivers`
 */
export const useDriversStore = defineStore("drivers", () => {
  /** Array of fetched `driver` objects */
  const drivers = ref<IDriver[]>([]);
  const driver = ref<IDriver>();

  /**
   * Fetches all the drivers from backend API.
   * Stores them in `clients`.
   *
   */
  async function getAllDrivers() {
    try {
      const response = await axios.get<IResponse<IDriver[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });
      drivers.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single client details from backend API.
   * Stores it in `client`.
   *
   * @param {number} id - Supplier ID
   */
  async function getDriver(id: number) {
    try {
      const response = await axios.post<IResponse<IDriver>>(
        getUserTypeForRoute("showDrivers"),
        { id },
        { headers: authHeader() }
      );

      driver.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    drivers,
    driver,
    getAllDrivers,
    getDriver,
  };
});
