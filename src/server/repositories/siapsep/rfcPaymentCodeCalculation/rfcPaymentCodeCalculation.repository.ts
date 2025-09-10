import { db } from '~/server/db';
import type { BulkInsertArgs } from '~/server/db/siapsep';

export const createMany = async (args: BulkInsertArgs) => {
  return await db.siapsep.executeBulkInsert({
    table: 'spn_rfcplaza',
    columns: [
      'rfc',
      'cod_pago',
      'unidad',
      'subunidad',
      'cat_puesto',
      'horas',
      'cons_plaza',
      'status',
    ],
    args,
  });
};

export const deleteAll = async () => {
  return await db.siapsep.execute({
    query: 'DELETE FROM spn_rfcplaza',
  });
};
