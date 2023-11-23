import type { IApiObject } from "./api";

/**
 * Interface for the `products` returned by the backend API
 *
 */
export interface IProducts extends IApiObject {
  name: string;
  description: string;
  docket: string;
  price: string;
  epa_number: string;
  gst_check: string;
  gst: string;
  uom: string;
}
