export interface GetCurrentFornightI {
    qna_proc: number | null;
    estatus_proc: string | null;
  }
  
export type GetLastSecondaryFortnightI = Pick<GetCurrentFornightI, 'qna_proc'>;
  
export type GetOpenFornightsI = GetCurrentFornightI & { cons_qna_proc: number };