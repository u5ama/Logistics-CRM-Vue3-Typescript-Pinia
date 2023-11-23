import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IAllocatedJob, IJob } from "@app-types/jobs";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { IResourceAsset } from "@/types/resources";
import type { IClients } from "@/types/clients";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("jobs");
const BASE_URL_Job = getUserTypeForRoute("getDriverAllocatedJobs");
const BASE_URL_Asset = getUserTypeForRoute("assets");
const BASE_URL_Client = getUserTypeForRoute("assets");

/**
 * Pinia store to manage `jobs`
 */
export const useDriverJobsStore = defineStore("driver-jobs", () => {
  /** Array of fetched `driver jobs` objects */
  const jobs = ref<IJob[]>([]);
  const assets = ref<IResourceAsset[]>([]);
  const clients = ref<IClients[]>([]);
  const allocatedJobs = ref<IAllocatedJob[]>([]);
  /** Fetched `driver-job` object */
  const job = ref<IJob>();
  /**
   * Fetches all the jobs from backend API.
   * Stores them in `jobs`.
   *
   */
  async function getAllJobs() {
    try {
      const response = await axios.get<IResponse<IJob[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });

      jobs.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  async function getAllAllocatedJobs(driverId: number) {
    try {
      const response = await axios.get<IResponse<IAllocatedJob[]>>(
        `${BASE_URL_Job}/${driverId}`,
        {
          headers: authHeader(),
        }
      );

      allocatedJobs.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new job to the Database.
   *
   * @param {IInvoice} job - The Job object
   */
  const addJob = async (job: IJob) => {
    try {
      const response = await axios.post<IResponse<IJob>>(`${BASE_URL}`, job, {
        headers: authHeader(),
      });

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Fetches a single job details from backend API.
   * Stores it in `job`.
   *
   * @param {number} id - Job ID
   */
  async function getJob(id: number) {
    try {
      const response = await axios.post<IResponse<IJob>>(
        getUserTypeForRoute("showJob"),
        { id },
        { headers: authHeader() }
      );

      job.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing job properties.
   *
   * @param jobId
   * @param jobInfo
   */
  const updateJob = async (jobId: number, jobInfo: IJob) => {
    try {
      const response = await axios.post<IResponse<IJob>>(
        `${BASE_URL}/${jobId}`,
        jobInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a *jobs* from the Database.
   * Also removes it from local state.
   *
   * @param {number} jobId - ID of the item to remove
   */
  const deleteJob = async (jobId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${jobId}`,
        { headers: authHeader() }
      );

      jobs.value = jobs.value.filter((job) => job.id !== jobId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  async function getAllAssets() {
    try {
      const response = await axios.get<IResponse<IResourceAsset[]>>(
        `${BASE_URL_Asset}`,
        { headers: authHeader() }
      );

      assets.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  async function getAllClients() {
    try {
      const response = await axios.get<IResponse<IClients[]>>(
        `${BASE_URL_Client}`,
        {
          headers: authHeader(),
        }
      );
      clients.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }
  return {
    jobs,
    allocatedJobs,
    job,
    assets,
    clients,
    getJob,
    getAllJobs,
    getAllAllocatedJobs,
    updateJob,
    addJob,
    deleteJob,
    getAllAssets,
    getAllClients,
  };
});
