import type { IApiObject } from "./api";

/**
 * Interface for the `checklist` returned by the backend API
 *
 */
export interface IChecklist extends IApiObject {
  name: string;
  checklists: IChecklistItems[];
}

/**
 * Interface for the `checklist Items` returned by the backend API
 *
 */
export interface IChecklistItems extends IApiObject {
  selectedOption: string;
  checkbox_question: string;
  checkbox_question_key_name: string;
  checkListOptions: IChecklistOptions[];
}

/**
 * Interface for the `checklist options` returned by the backend API
 *
 */
export interface IChecklistOptions {
  name: string;
  option_question_key_name: string;
}

/**
 * Interface for the `driver checklist` returned by the backend API
 *
 */
export interface IDriverChecklist extends IApiObject {
  driver_name: string;
  job_name: string;
  checklist_name: string;
  checklist_id: string;
  selected_checklist: [];
}
