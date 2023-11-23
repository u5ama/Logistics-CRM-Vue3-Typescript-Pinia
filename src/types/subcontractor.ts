import type { IApiObject } from "./api";

/**
 * Interface for the `subcontractors` returned by the backend API
 *
 */
export interface ISubcontractor extends IApiObject {
  name: string;
  email: string;
  phone: string;
  abn: string;
  tags: [];
}

/**
 * Interface for the `documents` returned by the backend API
 *
 */
export interface ISubcontractorDocument extends IApiObject {
  title: string;
  reminder: string;
  file: string;
  status: DocumentStatus;
}

/**
 * Interface for the `driver` returned by the backend API
 *
 */
export interface ISubcontractorDriver extends IApiObject {
  user_id: number;
  subcontractor_id: number;
  name: string;
  email: string;
}

export enum DocumentStatus {
  Approved = "Approved",
  NotApproved = "NotApproved",
}