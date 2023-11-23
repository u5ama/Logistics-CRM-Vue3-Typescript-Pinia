import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { ISupplier } from "@app-types/supplier";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("supplier");

/**
 * Pinia store to manage `suppliers`
 */
export const useSuppliersStore = defineStore("supplier", () => {
  /** Array of fetched `suppliers` objects */
  const suppliers = ref<ISupplier[]>([]);

  /** Fetched `supplier` object */
  const supplier = ref<ISupplier>();
  /**
   * Fetches all the suppliers from backend API.
   * Stores them in `suppliers`.
   *
   */
  async function getAllSuppliers() {
    try {
      const response = await axios.get<IResponse<ISupplier[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      });

      suppliers.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new supplier to the Database.
   *
   * @param {ISupplier} supplier - The supplier object
   */
  const addSupplier = async (supplier: ISupplier) => {
    try {
      const response = await axios.post<IResponse<ISupplier>>(
        `${BASE_URL}`,
        supplier,
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
   * Fetches a single supplier details from backend API.
   * Stores it in `supplier`.
   *
   * @param {number} id - Supplier ID
   */
  async function getSupplier(id: number) {
    try {
      const response = await axios.post<IResponse<ISupplier>>(
        getUserTypeForRoute("showSupplier"),
        { id },
        { headers: authHeader() }
      );

      supplier.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing supplier properties.
   *
   * @param supplierId
   * @param supplierInfo
   */
  const updateSupplier = async (
    supplierId: number,
    supplierInfo: ISupplier
  ) => {
    try {
      const response = await axios.post<IResponse<ISupplier>>(
        `${BASE_URL}/${supplierId}`,
        supplierInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    suppliers,
    supplier,
    getSupplier,
    getAllSuppliers,
    updateSupplier,
    addSupplier,
  };
});
