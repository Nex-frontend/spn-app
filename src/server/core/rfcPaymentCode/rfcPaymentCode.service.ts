import { core } from '~/server/core';
import { repository } from '~/server/repositories';

export interface RfcPaymentCodeI {
  rfc: string;
  payCode: string;
  unit: string;
  subunit: string;
  positionCategory: string;
  hours: string;
  consecutivePayment: string;
  status: number | null;
}

interface createRfcPaymentCodeCalculationI<T extends RfcPaymentCodeI> {
  data: T[];
}

export const createRfcPaymentCodeCalculation = async <T extends RfcPaymentCodeI>({
  data,
}: createRfcPaymentCodeCalculationI<T>) => {
  const rfcPrepared = core.query.prepareToSQLBulkValues({
    columns: [
      'rfc',
      'payCode',
      'unit',
      'subunit',
      'positionCategory',
      'hours',
      'consecutivePayment',
      'status',
    ] as const,
    data,
  });

  await repository.siapsep.rfcPaymentCodeCalculation.deleteAll();
  await repository.siapsep.rfcPaymentCodeCalculation.createMany(rfcPrepared);
};
