import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@/types/api";
import type { IClients } from "@/types/clients";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("clients");

/**
 * Pinia store to manage `clients`
 */
export const useClientsStore = defineStore("clients", () => {
  /** Array of fetched `client` objects */
  const clients = ref<IClients[]>([]);
  const client = ref<IClients>();

  /**
   * Fetches all the clients from backend API.
   * Stores them in `clients`.
   *
   */
  async function getAllClients() {
    try {
      const response = await axios.get<IResponse<IClients[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });
      clients.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Removes a client from the Database.
   * Also removes it from local state.
   *
   * @param {number} clientId - ID of the client to remove
   */
  const deleteClient = async (clientId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${clientId}`,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      clients.value = clients.value.filter((client) => client.id !== clientId);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new client to the Database.
   *
   * @param {IClients} client - The client object
   */
  async function addClient(client: IClients) {
    try {
      const response = await axios.post<IResponse<IClients>>(
        `${BASE_URL}`,
        client,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
      clients.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing client properties.
   *
   * @param {number} clientId - ID of the client to be updated
   * @param {IClients} clientInfo - client object with updated properties
   */
  async function updateClient(clientId: number, clientInfo: IClients) {
    try {
      const response = await axios.post<IResponse<IClients>>(
        `${BASE_URL}/${clientId}`,
        clientInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      clients.value = clients.value.map((client) =>
        client.id === clientId ? { ...response.data.data! } : client
      );
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
  async function getClient(id: number) {
    try {
      const response = await axios.post<IResponse<IClients>>(
        getUserTypeForRoute("showClients"),
        { id },
        { headers: authHeader() }
      );

      client.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    clients,
    client,
    getAllClients,
    getClient,
    updateClient,
    addClient,
    deleteClient,
  };
});
