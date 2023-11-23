import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IQuoteFooter } from "@app-types/quotes";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("quoteFooter");

/**
 * Pinia store to manage `quotes footer`
 */
export const useQuoteFooterStore = defineStore("quote-footer", () => {
  /** Array of fetched `quotes footer` objects */
  const quoteFooters = ref<IQuoteFooter[]>([]);

  /** Fetched `quote footer` object */
  const quoteFooter = ref<IQuoteFooter>();

  /**
   * Fetches all the quotes footer from backend API.
   * Stores them in `quotes footer`.
   *
   */
  async function getAllQuoteFooters() {
    try {
      const response = await axios.get<IResponse<IQuoteFooter[]>>(
        `${BASE_URL}`,
        {
          headers: authHeader(),
        }
      );

      quoteFooters.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new quote footer to the Database.
   *
   * @param {IQuoteFooter} quoteFooter - The Quote object
   */
  const addQuoteFooter = async (quoteFooter: IQuoteFooter) => {
    try {
      const response = await axios.post<IResponse<IQuoteFooter>>(
        `${BASE_URL}`,
        quoteFooter,
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
   * Fetches a single quote footer details from backend API.
   * Stores it in `quote footer`.
   *
   * @param {number} id - quote ID
   */
  async function getQuoteFooter(id: number) {
    try {
      const response = await axios.post<IResponse<IQuoteFooter>>(
        getUserTypeForRoute("showQuoteFooter"),
        { id },
        { headers: authHeader() }
      );

      quoteFooter.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing properties.
   *
   * @param quoteFooterId
   * @param quoteFooter
   */
  const updateQuoteFooter = async (
    quoteFooterId: number,
    quoteFooter: IQuoteFooter
  ) => {
    try {
      const response = await axios.post<IResponse<IQuoteFooter>>(
        `${BASE_URL}/${quoteFooterId}`,
        quoteFooter,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a *quotes footer* from the Database.
   * Also removes it from local state.
   *
   * @param {number} quoteFooterId - ID of the item to remove
   */
  const deleteQuoteFooter = async (quoteFooterId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${quoteFooterId}`,
        { headers: authHeader() }
      );

      quoteFooters.value = quoteFooters.value.filter(
        (quoteFooter) => quoteFooter.id !== quoteFooterId
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    quoteFooters,
    quoteFooter,
    getAllQuoteFooters,
    addQuoteFooter,
    getQuoteFooter,
    updateQuoteFooter,
    deleteQuoteFooter,
  };
});
