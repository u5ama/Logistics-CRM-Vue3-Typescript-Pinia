import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { ISupplierContact } from "@/types/supplier";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("supplierContact");

/**
 * Pinia store to manage supplier contacts
 */
export const useSupplierContactsStore = defineStore("supplier-contacts", () => {
  /** Array of *supplier `contacts`* objects */
  const contacts = ref<ISupplierContact[]>([]);

  /** Fetched `contact` object */
  const contact = ref<ISupplierContact>();

  /**
   * Fetches all the supplier contacts from backend API.
   * Stores them in `contacts`.
   *
   * @param {number} supplierId - ID of the supplier
   */
  const getAllContacts = async (supplierId: number) => {
    try {
      const response = await axios.get<IResponse<ISupplierContact[]>>(
        `${BASE_URL}?supplier_id=${supplierId}`,
        { headers: authHeader() }
      );

      contacts.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new contact to the Database.
   *
   * @param {ISupplierContact} con - The supplier contact object
   */
  async function addContact(con: ISupplierContact) {
    try {
      const response = await axios.post<IResponse<ISupplierContact>>(
        `${BASE_URL}`,
        con,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      contacts.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single supplier contact details from backend API.
   * Stores it in `supplier contact`.
   *
   * @param {number} id - Contact ID
   */
  async function getContact(id: number) {
    try {
      const response = await axios.post<IResponse<ISupplierContact>>(
        getUserTypeForRoute("showSupplierContact"),
        { id },
        { headers: authHeader() }
      );

      contact.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Removes a *supplier contacts* from the Database.
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

  /**
   * Update an existing supplier contact.
   *
   * @param {number} contactId - ID of the contact to be updated
   * @param {ISupplierContact} contactInfo - contact object with updated properties
   */
  async function updateContact(
    contactId: number,
    contactInfo: ISupplierContact
  ) {
    try {
      const response = await axios.post<IResponse<ISupplierContact>>(
        `${BASE_URL}/${contactId}`,
        contactInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      contacts.value = contacts.value.map((contact) =>
        contact.id === contactId ? { ...response.data.data! } : contact
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    contacts,
    contact,
    getContact,
    getAllContacts,
    addContact,
    deleteContact,
    updateContact,
  };
});
