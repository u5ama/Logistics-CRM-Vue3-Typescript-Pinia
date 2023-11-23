import type { IApiObject } from "./api";

/**
 * Interface for the `clients` returned by the backend API
 *
 */
export interface IClients extends IApiObject {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  account_terms: string;
  abn: string;
  credit_limit: string;
}

/**
 * Interface for the `documents` returned by the backend API
 *
 */
export interface IClientDocuments extends IApiObject {
  title: string;
  file: string;
}

/**
 * Interface for the `contacts` returned by the backend API
 *
 */
export interface IClientContacts extends IApiObject {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
}
