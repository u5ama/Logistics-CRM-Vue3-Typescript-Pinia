import type { IApiObject } from "./api";

/**
 * Interface for the `settings` returned by the backend API
 *
 */
export interface ISettings extends IApiObject {
  token_type: string;
  connection_status: string;
  access_token: string;
  refresh_token: string;
  connection_type: string;
}
