import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { IJobDrivers } from "@/types/jobs";
import { useToast } from "vue-toastification";
import type { IClients } from "@/types/clients";
import { getUserTypeForRoute } from "@utils/helpers";
import type { IResourceAsset } from "@/types/resources";

const BASE_URL = getUserTypeForRoute("fieldworkers");

/**
 * Pinia store to manage job drivers
 */
export const useJobDriversStore = defineStore("job-drivers", () => {
  /** Array of *user `drivers`* objects */
  const drivers = ref<IJobDrivers[]>([]);
  const allDrivers = ref<IClients[]>([]);
  const jobAssets = ref<IResourceAsset[]>([]);

  /**
   * Fetches all the job drivers from backend API.
   * Stores them in `drivers`.
   *
   * @param {number} jobId - ID of the job
   */
  const getAllDrivers = async (jobId: number) => {
    try {
      const response = await axios.get<IResponse<IJobDrivers[]>>(
        `${BASE_URL}/${jobId}`,
        { headers: authHeader() }
      );

      drivers.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Fetches all the job assets from backend API.
   * Stores them in `drivers`.
   *
   * @param {number} jobId - ID of the job
   */
  const getAllJobAssets = async (jobId: number) => {
    try {
      const response = await axios.get<IResponse<IResourceAsset[]>>(
        getUserTypeForRoute(`jobAssets/${jobId}`),
        { headers: authHeader() }
      );

      jobAssets.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *job `drivers`* to the database.
   * Pushes it to local `drivers`.
   *
   * @param {number} job_id - ID of the job
   * @param {string} driver_id - ID of driver
   * @param {string} asset_id - ID of Asset
   *
   * @return {boolean} - if the document was added successfully or not
   */
  const addDriver = async (
    job_id: number,
    driver_id: string,
    asset_id: string
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("job_id", job_id.toString());
      formData.append("user_id", driver_id);
      formData.append("asset_id", asset_id);
      const response = await axios.post<IResponse<IJobDrivers>>(
        `${BASE_URL}`,
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data.message;

      drivers.value.push(response.data.data!);

      return true;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else useToast().error(e as string);

      return false;
    }
  };

  /**
   * Removes a *job drivers* from the Database.
   * Also removes it from local state.
   *
   * @param job_id
   * @param driver_id
   */
  const deleteDriver = async (job_id: number, driver_id: string) => {
    try {
      const formData = new FormData();
      formData.append("job_id", job_id.toString());
      formData.append("user_id", driver_id);
      const response = await axios.post<IResponse<IJobDrivers>>(
        getUserTypeForRoute(`removeAssignFieldworker`),
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data.message;

      drivers.value.push(response.data.data!);

      return true;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else useToast().error(e as string);

      return false;
    }
  };

  async function allDriversList() {
    try {
      const response = await axios.get<IResponse<IClients[]>>(
        getUserTypeForRoute(`allDrivers`),
        {
          headers: authHeader(),
        }
      );

      allDrivers.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    drivers,
    jobAssets,
    allDrivers,
    getAllJobAssets,
    getAllDrivers,
    addDriver,
    deleteDriver,
    allDriversList,
  };
});
