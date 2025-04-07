import { db } from '~/server/db';

interface GetCurrentFornightI {
  qna_proc: number | null;
  estatus_proc: string | null;
}

type GetLastSecondaryFortnightI = Pick<GetCurrentFornightI, 'qna_proc'>;

type GetOpenFornightsI = GetCurrentFornightI & { cons_qna_proc: number };

export const getCurrentFortnight = async () => {
  return await db.siapsep.executeSingle<GetCurrentFornightI>({
    query: `SELECT FIRST 1 qna_proc, estatus_proc
    FROM control_qna_proc WHERE cons_qna_proc =  0
    order by qna_proc desc`,
  });
};

export const getLastSecondaryFortnight = async () => {
  return await db.siapsep.executeSingle<GetLastSecondaryFortnightI>({
    query: 'SELECT max(qna_proc) as qna_proc FROM control_qna_proc WHERE cons_qna_proc != 0',
  });
};

export const getNoClosedFornight = async () => {
  return await db.siapsep.execute<GetOpenFornightsI>({
    query: `SELECT qna_proc, estatus_proc, cons_qna_proc FROM control_qna_proc WHERE estatus_proc != ?`,
    args: ['Q'],
  });
};
