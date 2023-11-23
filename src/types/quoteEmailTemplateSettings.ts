import type { IApiObject } from "./api";

/**
 * Interface for the quote email settings` returned by the backend API
 *
 */
export interface IQuoteEmailTemplateSettings extends IApiObject {
  terms_conditions: string;
  op_manager_name: string;
  op_manager_email: string;
  op_manager_phone: string;
  quote_note: string;
  company_name: string;
}
