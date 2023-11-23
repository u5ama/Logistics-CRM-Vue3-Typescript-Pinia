import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IQuote, ISales } from "@app-types/quotes";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";
import { useToast } from "vue-toastification";

const BASE_URL = getUserTypeForRoute("quotes");

/**
 * Pinia store to manage `quotes`
 */
export const useQuotesStore = defineStore("quotes", () => {
  /** Array of fetched `quotes` objects */
  const quotes = ref<IQuote[]>([]);

  /** Fetched `quote` object */
  const quote = ref<IQuote>();

  /** Array of fetched `sales` objects */
  const sales = ref<ISales[]>([]);

  /**
   * Fetches all the quotes from backend API.
   * Stores them in `quotes`.
   *
   */
  async function getAllQuotes() {
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
   * Adds a new quote to the Database.
   *
   * @param {IQuote} quote - The Quote object
   */
  const addQuote = async (quote: IQuote) => {
    try {
      const response = await axios.post<IResponse<IQuote>>(
        `${BASE_URL}`,
         quote,
        {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Fetches a single quote details from backend API.
   * Stores it in `quote`.
   *
   * @param {number} id - quote ID
   */
  async function getQuote(id: number) {
    try {
      const response = await axios.post<IResponse<IQuote>>(
        getUserTypeForRoute("showQuotes"),
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
   * Send quote to client on email.
   *
   * @param {number} id - Quote ID
   */
  async function sendQuoteEmail(id: number) {
    try {
      const response = await axios.post<IResponse<IQuote>>(
        getUserTypeForRoute("sendQuoteEmail"),
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
   * Update an existing quote properties.
   *
   * @param quoteId
   * @param quoteInfo
   */
  const updateQuote = async (quoteId: number, quoteInfo: IQuote) => {
    try {
      const response = await axios.post<IResponse<IQuote>>(
        `${BASE_URL}/${quoteId}`,
        quoteInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a *quotes* from the Database.
   * Also removes it from local state.
   *
   * @param {number} quoteId - ID of the item to remove
   */
  const deleteQuote = async (quoteId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${quoteId}`,
        { headers: authHeader() }
      );

      quotes.value = quotes.value.filter((quote) => quote.id !== quoteId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  async function getAllSales() {
    try {
      const response = await axios.get<IResponse<ISales[]>>(
        getUserTypeForRoute(`salesPersons`),
        {
          headers: authHeader(),
        }
      );
      sales.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  async function acceptQuoteJob(id: number) {
    try {
      const response = await axios.post<IResponse<IQuote>>(
        getUserTypeForRoute("acceptQuoteJob"),
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
   * Adds a new * `document`* to the database.
   * Pushes it to local `documents`.
   *
   * @return {boolean} - if the document was added successfully or not
   * @param formData
   */
  const uploadDocumentForSign = async (formData: any): Promise<boolean> => {
    try {
      const response = await axios.post<IResponse<undefined>>(
        getUserTypeForRoute("uploadFileForSign"),
        formData,
        {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("PDF uploaded successfully");
        return true;
      } else {
        console.error("Error uploading PDF:", response.data.message);
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) handleAxiosErrors(error);
      else useToast().error(error as string);
      return false;
    }
  };

  return {
    sales,
    quotes,
    quote,
    getQuote,
    getAllQuotes,
    updateQuote,
    addQuote,
    deleteQuote,
    sendQuoteEmail,
    getAllSales,
    acceptQuoteJob,
    uploadDocumentForSign,
  };
});
