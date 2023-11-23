import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { IJobTimeSheets } from "@/types/jobs";
import { useToast } from "vue-toastification";
import type { IClients } from "@/types/clients";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("timesheets");

/**
 * Pinia store to manage job timesheet
 */
export const useJobTimeSheetDriverStore = defineStore(
  "job-timesheets-driver",
  () => {
    /** Array of *user `driver timesheets`* objects */
    const timesheets = ref<IJobTimeSheets[]>([]);
    const allDrivers = ref<IClients[]>([]);

    /**
     * Fetches all the job timesheet from backend API.
     * Stores them in `drivers`.
     *
     * @param {number} jobId - ID of the job
     */
    const getAllTimeSheets = async (jobId: number) => {
      try {
        const response = await axios.get<IResponse<IJobTimeSheets[]>>(
          `${BASE_URL}/${jobId}`,
          { headers: authHeader() }
        );

        timesheets.value = [...response.data.data!];
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Adds a new *job `timesheet`* to the database.
     * Pushes it to local `documents`.
     *
     * @param {number} job_id - ID of the job
     * @param {number} asset_id
     * @param {string} startTime - ID of driver
     * @param {string} endTime - ID of driver
     * @param {string} is_confirmed - ID of driver
     * @param {File} upload_file - the `File` object to be uploaded
     * @return {boolean} - if the document was added successfully or not
     */
    const addTimeSheet = async (
      job_id: number,
      asset_id: number,
      startTime: string,
      endTime: string,
      is_confirmed: string,
      upload_file: File
    ): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append("job_id", job_id.toString());
        formData.append("asset_id", asset_id.toString());
        formData.append("start_time", startTime);
        formData.append("end_time", endTime);
        formData.append("is_confirmed", is_confirmed);
        formData.append("upload_file", upload_file, upload_file.name);
        const response = await axios.post<IResponse<IJobTimeSheets>>(
          `${BASE_URL}`,
          formData,
          { headers: authHeader() }
        );

        if (!response.data.success) throw response.data.message;

        timesheets.value.push(response.data.data!);

        return true;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else useToast().error(e as string);

        return false;
      }
    };

    /**
     * Removes a *job timesheet* from the Database.
     * Also removes it from local state.
     *
     * @param {number} sheetId - ID of the driver to remove
     */
    const deleteTimeSheet = async (sheetId: number) => {
      try {
        const response = await axios.delete<IResponse<undefined>>(
          `${BASE_URL}/${sheetId}`,
          { headers: authHeader() }
        );

        timesheets.value = timesheets.value.filter((doc) => doc.id !== sheetId);

        if (!response.data.success) throw response.data;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Fetches a list of all drivers.
     * Retrieves the data through a GET request to the appropriate API endpoint.
     * Populates the `allDrivers` ref with the received data.
     */
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
      timesheets,
      allDrivers,
      getAllTimeSheets,
      addTimeSheet,
      deleteTimeSheet,
      allDriversList,
    };
  }
);
