import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IProducts } from "@app-types/products";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("products");

/**
 * Pinia store to manage `products`
 */
export const useProductsStore = defineStore("products", () => {
  /** Array of fetched `product` objects */
  const products = ref<IProducts[]>([]);

  /** Fetched `product` object */
  const product = ref<IProducts>();

  /**
   * Fetches all the products from backend API.
   * Stores them in `products`.
   *
   */
  async function getAllProducts() {
    try {
      const response = await axios.get<IResponse<IProducts[]>>(`${BASE_URL}`, {
        headers: authHeader(),
      })
      products.value = [...response.data.data!];
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Fetches a single product details from backend API.
   * Stores it in `products`.
   *
   * @param {number} id - Product ID
   */
  async function getProduct(id: number) {
    try {
      const response = await axios.post<IResponse<IProducts>>(
        getUserTypeForRoute("showProduct"),
        { id },
        { headers: authHeader() }
      );
      product.value = response.data.data!;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Removes a product from the Database.
   * Also removes it from local state.
   *
   * @param {number} productId - ID of the product to remove
   */
  const deleteProduct = async (productId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${productId}`,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      products.value = products.value.filter(
        (product) => product.id !== productId
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new product to the Database.
   *
   * @param {IProducts} product - The product object
   */
  async function addProduct(product: IProducts) {
    try {
      const response = await axios.post<IResponse<IProducts>>(
        `${BASE_URL}`,
        product,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      products.value.push(response.data.data!);
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  /**
   * Update an existing products properties.
   *
   * @param {number} productId - ID of the product to be updated
   * @param {IProducts} productInfo - product object with updated properties
   */
  async function updateProduct(productId: number, productInfo: IProducts) {
    try {
      const response = await axios.post<IResponse<IProducts>>(
        `${BASE_URL}/${productId}`,
        productInfo,
        { headers: authHeader() }
      );

      if (!response.data.success) throw response.data;

      products.value = products.value.map((product) =>
        product.id === productId ? { ...response.data.data! } : product
      );
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  }

  return {
    products,
    product,
    getProduct,
    getAllProducts,
    updateProduct,
    addProduct,
    deleteProduct,
  };
});
