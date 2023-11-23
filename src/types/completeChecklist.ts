/**
 * Interface for the `CompleteChecklist` returned by the backend API
 *
 */
export interface ICompleteChecklist {
  checklists: {
    question_id: string;
    select_type: string;
    checklist_question: string;
    options: { option_name: string; id: number; checked?: boolean }[];
    answer?: string;
  }[];
}
