import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IAssetSubcontractors } from "@app-types/resources";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { useToast } from "vue-toastification";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("assetSubcontractor");

/**
 * Pinia store to manage user documents
 */
export const useAssetSubcontractorStore = defineStore(
  "asset-subcontractor",
  () => {
    /** Array of *user `document`* objects */
    const subcontractors = ref<IAssetSubcontractors[]>([]);

    /**
     * Fetches all the user subcontractors from backend API.
     * Stores them in `subcontractors`.
     *
     * @param {number} assetId - ID of the user
     */
    const getAllSubcontractors = async (assetId: number) => {
      try {
        const response = await axios.get<IResponse<IAssetSubcontractors[]>>(
          `${BASE_URL}?asset_id=${assetId}`,
          { headers: authHeader() }
        );

        subcontractors.value = [...response.data.data!];
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Adds a new *user `subcontractor`* to the database.
     * Pushes it to local `documents`.
     *
     * @param {number} asset_id - ID of the Asset
     * @param {number} subcontractor_id - subcontractor_id for the subcontractor
     * @param {string} charge_type
     * @param {string} charge_unit
     *
     * @return {boolean} - if the subcontractor was added successfully or not
     */
    const addSubcontractor = async (
      asset_id: number,
      subcontractor_id: string,
      charge_type: string,
      charge_unit: string,
    ): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append("asset_id", asset_id.toString());
        formData.append("subcontractor_id", subcontractor_id);
        formData.append("charge_type", charge_type);
        formData.append("charge_unit", charge_unit);

        const response = await axios.post<IResponse<IAssetSubcontractors>>(
          `${BASE_URL}`,
          formData,
          { headers: authHeader() }
        );

        if (!response.data.success) throw response.data.message;
        subcontractors.value.push(response.data.data!);

        return true;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else useToast().error(e as string);

        return false;
      }
    };

    // @ts-ignore
    const updateSubcontractor = async (subcontractorId: number, subcontractorInfo: IAssetSubcontractors): Promise<boolean> => {
      try {
        const response = await axios.post<IResponse<IAssetSubcontractors>>(
          `${BASE_URL}/${subcontractorId}`,
          subcontractorInfo,
          { headers: authHeader() }
        );

        if (!response.data.success) throw response.data;

            subcontractors.value = subcontractors.value.map((subcontractor) =>
            subcontractor.id === subcontractorId ? { ...response.data.data! } : subcontractor
        );
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    /**
     * Removes a *assetSubcontractor* from the Database.
     * Also removes it from local state.
     *
     * @param {number} subcontractorId - ID of the subcontractor to remove
     */
    const deleteSubcontractor = async (subcontractorId: number) => {
      try {
        const response = await axios.delete<IResponse<undefined>>(
          `${BASE_URL}/${subcontractorId}`,
          { headers: authHeader() }
        );

        subcontractors.value = subcontractors.value.filter(
          (doc) => doc.id !== subcontractorId
        );

        if (!response.data.success) throw response.data;
      } catch (e) {
        if (axios.isAxiosError(e)) handleAxiosErrors(e);
        else throw e;
      }
    };

    return {
      subcontractors,
      updateSubcontractor,
      getAllSubcontractors,
      addSubcontractor,
      deleteSubcontractor,
    };
  }
);
