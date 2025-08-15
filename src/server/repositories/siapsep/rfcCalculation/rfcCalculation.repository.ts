import { GetRfcCalculationI } from './rfcCalculation.interface';
import { db } from '~/server/db';

export const getRfcCalculation = async () => {
  return await db.siapsep.execute<GetRfcCalculationI>({
    query: 'SELECT * FROM rfc_calculo',
  });
};

export const createManyRfcCalculation = async (rfcs: string[][]) => {
  return await db.siapsep.executeBulkInsert({
    table: 'rfc_calculo',
    columns: ['rfc'],
    args: rfcs,
  });
};
