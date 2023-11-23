import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IJob, IJobCalendar } from "@app-types/jobs";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("jobs");

/**
 * Pinia store to manage `jobs`
 */
export const useJobsStore = defineStore("jobs", () => {
  /** Array of fetched `jobs` objects */
  const jobs = ref<IJob[]>([]);
  const jobCalendar = ref<IJobCalendar[]>([]);

  /** Fetched `job` object */
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

  async function getCustomAllJobs() {
    try {
      const response = await axios.get<IResponse<IJobCalendar[]>>(getUserTypeForRoute("getAllJobs"), {
        headers: authHeader(),
      });

      jobCalendar.value = [...response.data.data!];
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

  /**
   * Update an existing job Date.
   *
   * @param jobId
   * @param start
   * @param end
   */
  const changeJobDate = async (jobId: number, start: any, end: any) => {
    try {
      const response = await axios.post<IResponse<IJob>>(
        getUserTypeForRoute("changeJobDate"),
        { jobId, start, end },
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    jobs,
    job,
    jobCalendar,
    getJob,
    getCustomAllJobs,
    getAllJobs,
    updateJob,
    changeJobDate,
    addJob,
    deleteJob,
  };
});
