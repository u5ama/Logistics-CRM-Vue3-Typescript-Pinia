import type { IApiObject } from "./api";

/**
 * Interface for the `drivers` returned by the backend API
 *
 */
export interface IDriver extends IApiObject {
  name: string;
  email: string;
  phone: string;
  address: string;
}
