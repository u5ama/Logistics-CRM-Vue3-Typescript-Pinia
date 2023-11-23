import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import type { IClientContacts } from "@/types/clients";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("clientContacts");

/**
 * Pinia store to manage client documents
 */
export const useClientContactsStore = defineStore("client-contacts", () => {
  /** Array of *client `document`* objects */
  const contacts = ref<IClientContacts[]>([]);

  /**
   * Fetches all the client contacts from backend API.
   * Stores them in `contacts`.
   *
   * @param {number} clientId - ID of the client
   */
  const getAllContacts = async (clientId: number) => {
    try {
      const response = await axios.get<IResponse<IClientContacts[]>>(
        `${BASE_URL}?client_id=${clientId}`,
        { headers: authHeader() }
      );

      contacts.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *client `contact`* to the database.
   * Pushes it to local `contacts`.
   *
   * @param {number} clientId - ID of the client
   * @param {string} first_name - first_name for the contact
   * @param {string} last_name - last_name for the contact
   * @param {string} phone - phone for the contact
   * @param {string} email - email for the contact
   * @param {string} address - address for the contact
   * @param {string} title - title for the contact
   *
   * @return {boolean} - if the contact was added successfully or not
   */
  const addContact = async (
    clientId: number,
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    address: string,
    title: string,
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("user_id", clientId.toString());
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("title", title);

      const response = await axios.post<IResponse<IClientContacts>>(
        `${BASE_URL}`,
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data.message;

      contacts.value.push(response.data.data!);

      return true;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else useToast().error(e as string);

      return false;
    }
  };

  /**
   * Removes a *client contact* from the Database.
   * Also removes it from local state.
   *
   * @param {number} contactId - ID of the contact to remove
   */
  const deleteContact = async (contactId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${contactId}`,
        { headers: authHeader() }
      );

      contacts.value = contacts.value.filter((doc) => doc.id !== contactId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    contacts,
    getAllContacts,
    addContact,
    deleteContact,
  };
});
