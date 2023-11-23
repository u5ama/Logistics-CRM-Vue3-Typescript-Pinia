import type { IApiObject } from "./api";

/**
 * Interface for the `supplier` returned by the backend API
 *
 */
export interface ISupplier extends IApiObject {
  name: string;
  email: string;
  phone: string;
  abn: string;
}

/**
 * Interface for the `documents` returned by the backend API
 *
 */
export interface ISupplierDocument extends IApiObject {
  title: string;
  file: string;
}

/**
 * Interface for the `contacts` returned by the backend API
 *
 */
export interface ISupplierContact extends IApiObject {
  name: string;
  email: string;
  phone: string;
  address: string;
  supplierId: number;
}

/**
 * Interface for the `items` returned by the backend API
 *
 */
export interface ISupplierItems extends IApiObject {
  item_code: string;
  item_description: string;
  site: string;
  unit_price: string;
  gst_incl: string;
  UOM: string;
  supplierId: number;
}
