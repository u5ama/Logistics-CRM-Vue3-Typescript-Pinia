import type { IApiObject } from "./api";

/**
 * Interface for the `job` returned by the backend API
 *
 */
export interface IJob extends IApiObject {
  asset_ids?: IJobAssets[];
  job_title: string;
  job_description: string;
  job_address: string;
  client_name?: string;
  client_id?: string;
  start_date: string;
  end_date: string;
}

/**
 * Interface for the `Allocated job` returned by the backend API
 *
 */
export interface IAllocatedJob extends IApiObject {
  job_title: string;
  job_description: string;
  job_address: string;
  start_date: string;
  end_date: string;
}

/**
 * Interface for the `job assets` returned by the backend API
 *
 */
export interface IJobAssets extends IApiObject {
  asset_id: number;
  start_date: string;
  end_date: string;
}

/**
 * Interface for the `job documents` returned by the backend API
 *
 */
export interface IJobDocument extends IApiObject {
  title: string;
  document_type: string;
  file: string;
}

/**
 * Interface for the `driver job documents` returned by the backend API
 *
 */
export interface IDriverJobDocument extends IApiObject {
  title: string;
  hire_docket: string;
  file: string;
  manual_image: string;
}

/**
 * Interface for the `job drivers` returned by the backend API
 *
 */
export interface IJobDrivers extends IApiObject {
  name: string;
  email: string;
}

/**
 * Interface for the `job timesheet` returned by the backend API
 *
 */
export interface IJobTimeSheets extends IApiObject {
  name: string;
  asset_name: string;
  start_time: string;
  end_time: string;
  is_confirmed: string;
  file: string;
  invoice_status: InvoiceStatus;
}

export enum InvoiceStatus {
  Invoiced = "Invoiced",
  NotInvoiced = "NotInvoiced",
}

export interface IJobCalendar {
  id: number;
  title: string;
  start: string;
  end: string;
  content: string;
  job_address: string;
  client_name?: string;
  assets?: Asset[];
  allDay: boolean;
}

interface Asset {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}