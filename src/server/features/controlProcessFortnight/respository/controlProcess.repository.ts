import { db } from '~/server/db';

export const getCurrentFortnight = async () => {
  return await db.siapsep.execute<{ qna_proc: number | null }>(
    'SELECT max(qna_proc) as qna_proc FROM control_qna_proc WHERE cons_qna_proc =  0',
    []
  );
};
