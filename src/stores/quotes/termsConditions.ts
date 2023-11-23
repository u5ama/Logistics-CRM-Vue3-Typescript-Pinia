import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IQuoteTermsConditions } from "@app-types/quotes";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("termsConditions");

/**
 * Pinia store to manage `quotes terms-conditions`
 */
export const useTermsConditionsStore = defineStore("terms-conditions", () => {
  /** Array of fetched `quotes terms-conditions` objects */
  const termsConditions = ref<IQuoteTermsConditions[]>([]);

  /** Fetched `quote terms-condition` object */
  const termsCondition = ref<IQuoteTermsConditions>();

  /**
   * Fetches all the quotes terms-conditions from backend API.
   * Stores them in `termsConditions`.
   *
   */
  async function getAllTermsConditions() {
    try {
      const response = await axios.get<IResponse<IQuoteTermsConditions[]>>(
        `${BASE_URL}`,
        {
          headers: authHeader(),
      });

      termsConditions.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new quote terms-condition to the Database.
   *
   * @param {IQuoteTermsConditions} termsCondition - The terms-conditions object
   */
  const addTermCondition = async (termsCondition: IQuoteTermsConditions) => {
    try {
      const response = await axios.post<IResponse<IQuoteTermsConditions>>(
        `${BASE_URL}`,
        termsCondition,
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
   * Fetches a single quote terms-conditions details from backend API.
   * Stores it in `termsCondition`.
   *
   * @param {number} id - quote ID
   */
  async function getTermsCondition(id: number) {
    try {
      const response = await axios.post<IResponse<IQuoteTermsConditions>>(
        getUserTypeForRoute("showTermsConditions"),
        { id },
        { headers: authHeader() }
      );

      termsCondition.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing properties.
   *
   * @param termsConditionId
   * @param termsCondition
   */
  const updateTermCondition = async (
    termsConditionId: number,
    termsCondition: IQuoteTermsConditions
  ) => {
    try {
      const response = await axios.post<IResponse<IQuoteTermsConditions>>(
        `${BASE_URL}/${termsConditionId}`,
        termsCondition,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a *quotes terms-conditions* from the Database.
   * Also removes it from local state.
   *
   * @param {number} termsConditionId - ID of the item to remove
   */
  const deleteTermCondition = async (termsConditionId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${termsConditionId}`,
        { headers: authHeader() }
      );

      termsConditions.value = termsConditions.value.filter((termsCondition) => termsCondition.id !== termsConditionId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    termsCondition,
    termsConditions,
    getAllTermsConditions,
    addTermCondition,
    getTermsCondition,
    updateTermCondition,
    deleteTermCondition,
  };
});
