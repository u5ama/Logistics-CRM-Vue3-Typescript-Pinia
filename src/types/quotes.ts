import type { IApiObject } from "./api";

/**
 * Interface for the `quote` returned by the backend API
 *
 */
export interface IQuote extends IApiObject {
  quote_name: string;
  client_id: string;
  job_id: string;
  representative_id: string;
  terms_condition_id: string;
  quote_footer_id: string;
  location: string;
  quote_entity: string;
  material_type: string;
  quote_status: string;
  quote_footer_text: string;
  terms_condition_text: string;
  assets: IQuoteAssets[];
  items: IQuoteItems[];
  files: File[];
}

/**
 * Interface for the `quote assets` returned by the backend API
 *
 */
export interface IQuoteAssets extends IApiObject {
  name: string;
}

/**
 * Interface for the `quote items` returned by the backend API
 *
 */
export interface IQuoteItems extends IApiObject {
  title: string;
  quote_id: string;
  quote_file: string;
  description: string;
  quote_price: string;
  title_key_name: string;
  description_key_name: string;
  quote_price_key_name: string;
}

/**
 * Interface for the `quote documents` returned by the backend API
 *
 */
export interface IQuoteDocument extends IApiObject {
  title: string;
  file: string;
}

/**
 * Interface for the `quote terms&conditions` returned by the backend API
 *
 */
export interface IQuoteTermsConditions extends IApiObject {
  title: string;
  terms_conditions: string;
}

/**
 * Interface for the `quote footer` returned by the backend API
 *
 */
export interface IQuoteFooter extends IApiObject {
  title: string;
  description: string;
}

/**
 * Interface for the `sales person` returned by the backend API
 *
 */
export interface ISales extends IApiObject {
  name: string;
  email: string;
  email_verified_at: string;
  user_status: UserStatus;
  user_type: UserType;
  deleted_at: string;
  token: string;
}

/**
 * Interface for the `sales person status` returned by the backend API
 *
 */
export enum UserStatus {
  Active = "active",
  NotActive = "NotActive",
}

/**
 * Interface for the `user types` returned by the backend API
 *
 */
export enum UserType {
  SuperAdmin = "1",
  Accounts = "2",
  Allocator = "3",
  Sales = "4",
  Driver = "5",
}
