import type { IApiObject } from "./api";
import type { ISubcontractor } from "./subcontractor";
import type { IUserWithProfile } from "./user";

/**
 * Interface for the `tags` returned by the backend API
 *
 */
export interface IResourceTag extends IApiObject {
  name: string;
  tag_type: ResourceTagType;
}

/**
 * Interface for the `skills` returned by the backend API
 *
 */
export interface IResourceSkill extends IApiObject {
  name: string;
}

/**
 * Interface for the `category` returned by the backend API
 *
 */
export interface IResourceCategory extends IApiObject {
  name: string;
}

/**
 * Different types of `tags types`
 *
 */
export enum ResourceTagType {
  Attachment = "attachment",
  Asset = "asset",
  Competency = "competency",
  Resource = "resource",
}

/**
 * Interface for the `attachments` returned by the backend API
 *
 */
/**
 * Interface for the `asset attachments` returned by the backend API
 *
 */
export interface IAssetAttachment extends IApiObject {
  name: string;
  description: string;
  rego_number: string;
  year: string;
  model: string;
  make: string;
  serial_number: string;
  avg_hourly_rate: string;
  current_number_reading: string;
  external_id: string;
  comments: string;
  tags: IResourceTag[];
}

/**
 * Interface for the `assets` returned by the backend API
 *
 */
export interface IResourceAsset extends IApiObject {
  name: string;
  description: string;
  rego_number: string;
  year: string;
  model: string;
  make: string;
  serial_number: string;
  avg_hourly_rate: string;
  current_number_reading: string;
  external_id: string;
  comments: string;
  tags: IResourceTag[];
  competencyTags: IResourceTag[];
  resourceTags: IResourceTag[];
  photo: string;
  skills: IResourceSkill[];
  workers: IUserWithProfile[];
  attachments: IAssetAttachment[];
  checklists: IAssetChecklists[];
}

/**
 * Interface for the `asset documents` returned by the backend API
 *
 */
export interface IAssetDocument extends IApiObject {
  title: string;
  expiry: string;
  alert: string;
  file: string;
}
/**
 * Interface for the `attachment documents` returned by the backend API
 *
 */
export interface IAttachmentDocument extends IApiObject {
  title: string;
  expiry: string;
  alert: string;
  file: string;
}

/**
 * Interface for the `asset checklist` returned by the backend API
 *
 */
export interface IAssetChecklists extends IApiObject {
  name: string;
}

/**
 * Interface for the `asset subcontractors` returned by the backend API
 *
 */
export interface IAssetSubcontractors extends IApiObject {
  subcontractor_id: string;
  name: string;
  phone: string;
  charge_unit: string;
  charge_type: string;
}

export interface ISubcontractorSMS extends IApiObject {
  subcontractors: ISubcontractor[];
  message: string;
}