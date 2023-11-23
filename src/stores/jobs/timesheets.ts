import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { IJobTimeSheets } from "@/types/jobs";
import { useToast } from "vue-toastification";
import type { IClients } from "@/types/clients";
import { getUserTypeForRoute } from "@utils/helpers";
import type { InvoiceStatus } from "@/types/jobs";
import type { IInvoice } from "@/types/invoices";

const BASE_URL = getUserTypeForRoute("timesheets");

/**
 * Pinia store to manage job timesheet
 */
export const useJobTimeSheetStore = defineStore("job-timsheets", () => {
  /** Array of *user `timesheet`* objects */
  const timesheets = ref<IJobTimeSheets[]>([]);
  const allDrivers = ref<IClients[]>([]);
  const allInvoices = ref<IInvoice[]>([]);

  /**
   * Fetches all the job timesheet from backend API.
   * Stores them in `timesheet`.
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

  const getAllDriversTimeSheets = async () => {
    try {
      const response = await axios.get<IResponse<IJobTimeSheets[]>>(
        `${BASE_URL}`,
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
   * Pushes it to local `timesheet`.
   *
   * @param {number} job_id - ID of the job
   * @param {number} user_id - ID of the job
   * @param {string} startTime - ID of driver
   * @param {string} endTime - ID of driver
   * @param {number} asset_id - ID of asset
   * @param {File} upload_file - the `File` object to be uploaded
   * @return {boolean} - if the document was added successfully or not
   */
  const addTimeSheet = async (
    job_id: number,
    user_id: number,
    startTime: string,
    endTime: string,
    asset_id: number,
    upload_file: File
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("job_id", job_id.toString());
      formData.append("user_id", user_id.toString());
      formData.append("start_time", startTime);
      formData.append("end_time", endTime);
      formData.append("asset_id", asset_id.toString());
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

  /**
   * Change a invoice's status as **Active** or **Inactive**.
   *
   * @param {number} timesheetId - The id of user to update
   * @param {InvoiceStatus} newStatus - New status of the invoice
   */
  const changeTimeSheetStatus = async (
    timesheetId: number,
    newStatus: InvoiceStatus
  ) => {
    try {
      const response = await axios.post<IResponse<IJobTimeSheets>>(
        getUserTypeForRoute("changeTimeSheetStatus") + "/" + timesheetId,
        { status: newStatus },
        {
          headers: authHeader(),
        }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Creates invoices for multiple selected timesheets.
   *
   * @param {any} selectedSheets - Selected timesheets for which invoices should be created
   */
  const createInvoiceForMultiple = async (selectedSheets: any) => {
    try {
      const response = await axios.post<IResponse<IJobTimeSheets>>(
        getUserTypeForRoute("createMultiInvoices"),
        { timesheets: selectedSheets },
        {
          headers: authHeader(),
        }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Fetches a list of all invoices for a specific job.
   * Retrieves the data through a GET request to the appropriate API endpoint.
   * Populates the `allInvoices` ref with the received data.
   *
   * @param {number} jobId - ID of the job
   */
  const allInvoicesList = async (jobId: number) => {
    try {
      const response = await axios.get<IResponse<IInvoice[]>>(
        getUserTypeForRoute("getAllInvoices") + "/" + jobId,
        { headers: authHeader() }
      );

      allInvoices.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds existing invoices for multiple selected timesheets.
   *
   * @param {number} invoiceId - ID of the existing invoice to add timesheets to
   * @param {any} selectedSheets - Selected timesheets to add to the existing invoice
   */
  const addExistingInvoiceForMultiple = async (invoiceId:number, selectedSheets: any) => {
    try {
      const response = await axios.post<IResponse<IJobTimeSheets>>(
        getUserTypeForRoute("addExistingMultiInvoices"),
        { invoiceId:invoiceId, timesheets: selectedSheets },
        {
          headers: authHeader(),
        }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    timesheets,
    allInvoices,
    allDrivers,
    getAllTimeSheets,
    createInvoiceForMultiple,
    getAllDriversTimeSheets,
    changeTimeSheetStatus,
    addTimeSheet,
    deleteTimeSheet,
    allDriversList,
    allInvoicesList,
    addExistingInvoiceForMultiple,
  };
});
