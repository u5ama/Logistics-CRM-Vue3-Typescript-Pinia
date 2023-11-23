import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IQuote } from "@app-types/quotes";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("client-quotes");

/**
 * Pinia store to manage `client quotes`
 */
export const useClientQuotesStore = defineStore("client-quotes", () => {
  /** Array of fetched `client quotes` objects */
  const quotes = ref<IQuote[]>([]);

  /** Fetched `client quote` object */
  const quote = ref<IQuote>();
  /**
   * Fetches all the client quotes from backend API.
   * Stores them in `client quotes`.
   *
   */
  async function getAllClientQuotes() {
    try {
      const response = await axios.get<IResponse<IQuote[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });

      quotes.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single client quote details from backend API.
   * Stores it in `client quote`.
   *
   * @param {number} id - quote ID
   */
  async function getQuote(id: number) {
    try {
      const response = await axios.post<IResponse<IQuote>>(
        getUserTypeForRoute("showClientQuotes"),
        { id },
        { headers: authHeader() }
      );

      quote.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Approve quote sent by admin.
   *
   * @param {number} id - Quote ID
   */
  async function approveQuote(id: number) {
    try {
      const response = await axios.post<IResponse<IQuote>>(
        getUserTypeForRoute("approveQuote"),
        { id },
        { headers: authHeader() }
      );

      quote.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    quotes,
    quote,
    getQuote,
    getAllClientQuotes,
    approveQuote,
  };
});
