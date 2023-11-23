import type { IApiObject } from "./api";

/**
 * Interface for the `quote settings` returned by the backend API
 *
 */
export interface IQuoteSettings extends IApiObject {
  user_ids: IQuoteEmailUsers[];
  terms_conditions: string;
  op_manager_name: string;
  op_manager_email: string;
  op_manager_phone: string;
}

/**
 * Interface for the `quote email users` returned by the backend API
 *
 */
export interface IQuoteEmailUsers extends IApiObject {
  name: string;
}
