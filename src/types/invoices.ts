import type { IApiObject } from "./api";

/**
 * Interface for the `invoice` returned by the backend API
 *
 */
export interface IInvoice extends IApiObject {
  invoice_name: string;
  client_id: string;
  job_id: string;
  invoice_entity: string;
  representative_id: string;
  invoice_status: InvoiceStatus;
  products: IInvoiceProducts[];
}

/**
 * Interface for the `invoice products` returned by the backend API
 *
 */
export interface IInvoiceProducts extends IApiObject {
  product_id: number;
  quantity: number;
  price: string;
  epa_number: string;
  product_key_name: string;
  quantity_key_name: string;
  epa_number_key_name: string;
  rate_key_name: string;
}

/**
 * Interface for the `invoice status` returned by the backend API
 *
 */
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
}

/**
 * Interface for the `allocated invoice` returned by the backend API
 *
 */
export interface IAllocatedInvoice extends IApiObject {
  subcontractor_id: string;
  invoice_id: string;
  amount: string;
  file: string;
}
