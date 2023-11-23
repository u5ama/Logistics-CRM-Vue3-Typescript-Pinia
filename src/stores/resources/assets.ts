import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IResourceAsset } from "@app-types/resources";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("assets");

/**
 * Pinia store to manage `assets`
 */
export const useResourceAssetsStore = defineStore("resource-assets", () => {
  /** Array of fetched `asset` objects */
  const assets = ref<IResourceAsset[]>([]);

  /** Fetched `asset` object */
  const asset = ref<IResourceAsset>();

  /**
   * Fetches all the assets from backend API.
   * Stores them in `assets`.
   *
   */
  async function getAllAssets() {
    try {
      const response = await axios.get<IResponse<IResourceAsset[]>>(
        `${BASE_URL}`,
        { headers: authHeader() }
      );

      assets.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single asset details from backend API.
   * Stores it in `asset`.
   *
   * @param {number} id - Asset ID
   */
  async function getAsset(id: number) {
    try {
      const response = await axios.post<IResponse<IResourceAsset>>(
        getUserTypeForRoute("showAsset"),
        { id },
        { headers: authHeader() }
      );

      asset.value = { ...response.data.data! };
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Adds a new *asset* to the database.
   * Pushes it to local state as well.
   *
   * @param {Partial<IResourceAsset>} asset - The asset object
   */
  async function addAsset(asset: Partial<IResourceAsset>) {
    try {
      const formData = new FormData();

      for (const key in asset) {
        if (Object.prototype.hasOwnProperty.call(asset, key)) {
          const value = (asset as Record<string, any>)[key];

          if (value) formData.append(key, value);
        }
      }

      const response = await axios.post<IResponse<IResourceAsset>>(
        `${BASE_URL}`,
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data.message;

      assets.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing *resource asset*.
   * Also updates the local state.
   *
   * @param {number} assetId - ID of the asset to be updated
   * @param {Partial<IResourceAsset>} assetData - Asset object with updated properties
   */
  async function updateAsset(
    assetId: number,
    assetData: Partial<IResourceAsset>
  ) {
    try {
      const formData = new FormData();

      for (const key in assetData) {
        if (Object.prototype.hasOwnProperty.call(assetData, key)) {
          const value = (assetData as Record<string, any>)[key];

          if (value) formData.append(key, value);
        }
      }

      const response = await axios.post<IResponse<IResourceAsset>>(
        `${BASE_URL}/${assetId}`,
        formData,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      assets.value = assets.value.map((att) =>
        att.id === assetId ? response.data.data! : att
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Removes an asset from the Database.
   * Also removes it from local state.
   *
   * @param {number} assetId - ID of the asset to remove
   */
  async function deleteAsset(assetId: number) {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${assetId}`,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      assets.value = assets.value.filter((asset) => asset.id !== assetId);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    assets,
    asset,
    addAsset,
    getAsset,
    updateAsset,
    getAllAssets,
    deleteAsset,
  };
});
