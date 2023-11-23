import type { IApiObject } from "./api";

/**
 * Interface for the `invoice email settings` returned by the backend API
 *
 */
export interface IEmailTemplateSettings extends IApiObject {
  account_name: string;
  account_bsb: string;
  account_number: string;
  inquiry_email: string;
  terms: string;
  note: string;
}
