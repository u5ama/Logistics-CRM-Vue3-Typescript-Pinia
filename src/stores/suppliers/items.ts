import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import type { ISupplierItems } from "@/types/supplier";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("supplierItem");

/**
 * Pinia store to manage supplier items
 */
export const useSupplierItemsStore = defineStore("supplier-items", () => {
  /** Array of *supplier `items`* objects */
  const items = ref<ISupplierItems[]>([]);

  /** Fetched `item` object */
  const item = ref<ISupplierItems>();

  /**
   * Fetches all the supplier items from backend API.
   * Stores them in `items`.
   *
   * @param {number} supplierId - ID of the supplier
   */
  const getAllItems = async (supplierId: number) => {
    try {
      const response = await axios.get<IResponse<ISupplierItems[]>>(
        `${BASE_URL}?supplier_id=${supplierId}`,
        { headers: authHeader() }
      );

      items.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new item to the Database.
   *
   * @param {ISupplierContact} con - The supplier item object
   */
  async function addItem(con: ISupplierItems) {
    try {
      const response = await axios.post<IResponse<ISupplierItems>>(
        `${BASE_URL}`,
        con,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      items.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single supplier item details from backend API.
   * Stores it in `supplier item`.
   *
   * @param {number} id - Contact ID
   */
  async function getItem(id: number) {
    try {
      const response = await axios.post<IResponse<ISupplierItems>>(
        getUserTypeForRoute("showSupplierItem"),
        { id },
        { headers: authHeader() }
      );

      item.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Removes a *supplier items* from the Database.
   * Also removes it from local state.
   *
   * @param {number} itemId - ID of the item to remove
   */
  const deleteItem = async (itemId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${itemId}`,
        { headers: authHeader() }
      );

      items.value = items.value.filter((item) => item.id !== itemId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Update an existing supplier items.
   *
   * @param {number} itemId - ID of the item to be updated
   * @param {ISupplierContact} contactInfo - contact object with updated properties
   */
  async function updateItem(itemId: number, contactInfo: ISupplierItems) {
    try {
      const response = await axios.post<IResponse<ISupplierItems>>(
        `${BASE_URL}/${itemId}`,
        contactInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      items.value = items.value.map((item) =>
        item.id === itemId ? { ...response.data.data! } : item
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    items,
    item,
    getItem,
    getAllItems,
    addItem,
    deleteItem,
    updateItem,
  };
});
