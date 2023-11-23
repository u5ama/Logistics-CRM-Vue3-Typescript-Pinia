import type { IApiObject } from "./api";

/**
 * Interface for the `dashboard assets` returned by the backend API
 *
 */
export interface IDashboardAssets extends IApiObject {
  job_title: string;
  start_date: string;
  end_date: string;
  asset_count: string;
}

/**
 * Interface for the `dashboard assets in use` returned by the backend API
 *
 */
export interface IDashboardAssetsInUse extends IApiObject {
  asset_name: string;
  start_date: string;
  end_date: string;
  tags: IDashTags[];
}

/**
 * Interface for the `dashboard tags` returned by the backend API
 *
 */
export interface IDashTags extends IApiObject {
  tag_name: string;
}

/**
 * Interface for the `dashboard allocated jobs` returned by the backend API
 *
 */
export interface IDashboardAllocatedJobs extends IApiObject {
  job_title: string;
  start_date: string;
  end_date: string;
  asset_count: string;
}

/**
 * Interface for the `dashboard safety` returned by the backend API
 *
 */
export interface IDashboardSafety extends IApiObject {
  checklists: IChecklists[];
  day: number | 0;
  twoDay: number | 0;
  week: number | 0;
}

/**
 * Interface for the `dashboard checklists` returned by the backend API
 *
 */
export interface IChecklists extends IApiObject {
  driver_name: string;
  job_name: string;
  checklist_name: string;
  checklist_id: string;
}
