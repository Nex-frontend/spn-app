import { refund } from '../..';
import { getSiapsepCount } from '../../services';
import { errorMapped, status, statusAviable, statusMapped } from './constants';
import {
  CloseVigenRefundsI,
  CreateRecordI,
  CreateRefundsI,
  DeleteInOtherConsecutiveI,
  DeleteRefundsI,
  GetSiconCaptureI,
  HandleEmptyCreateOrCloseRecordsI,
  PrepareCreateEPCColumn,
  RfcError,
  RfcSicon,
  RfcSuccess,
  StatusAviable,
  VerifyCloseVigenI,
} from './types';
import { core } from '~/server/core';
import { controlProcess } from '~/server/features/controlProcessFortnight';
import { repository } from '~/server/repositories';
import { RefundLogsCreate } from '~/server/repositories/spn/refund';
import { ErrorApp } from '~/shared';

// ==============================
// Validation Functions
// ==============================

const verifyRfcsExistsInEmployee = async (rfcCalculation: typeof core.rfc.rfc2, rfcs: RfcSicon) => {
  await rfcCalculation.createUniqueRFCs(rfcs);
  const rfcsNotFounded = await rfcCalculation.getRfcNotInEmployee();

  const returnObject = {
    rfcsNotFounded,
    rfcErrors: [] as RfcError[],
    hasError: false,
  };

  if (rfcsNotFounded.length > 0) {
    await rfcCalculation.deleteRfcNotInEmployee();

    returnObject.rfcErrors.push(
      ...rfcs
        .filter((item) => rfcsNotFounded.map((i) => i.rfc).includes(item.rfc))
        .map((i) => {
          return {
            ...i,
            error: errorMapped['notFound'],
          };
        })
    );
    returnObject.hasError = true;
  }

  return returnObject;
};

const verifyCloseVigen = async ({ statusGrouped, fortnight }: VerifyCloseVigenI) => {
  const rfcErrors: RfcError[] = [];
  const rfcSuccess: RfcSuccess[] = [];

  if (statusGrouped[status.close].length > 0) {
    const rfcNotEPC =
      await repository.siapsep.rfcPaymentCodeCalculation.refunds.getRfcNotEPC(fortnight);

    const rfcPaymentCodeNotEPC =
      await repository.siapsep.rfcPaymentCodeCalculation.refunds.getRfcPaymentCodeNotEPC(fortnight);

    statusGrouped[status.close].forEach((item) => {
      rfcNotEPC.forEach((rfcNotFounded) => {
        if (item.rfc === rfcNotFounded.rfc) {
          rfcErrors.push({ ...item, error: errorMapped['notFoundEPC'] });
        }
      });

      rfcPaymentCodeNotEPC.forEach((rfcCodeNotFounded) => {
        if (
          item.rfc === rfcCodeNotFounded.rfc &&
          item.payCode === `${rfcCodeNotFounded.cod_pago}` &&
          item.unit === `${rfcCodeNotFounded.unidad}` &&
          item.subunit === `${rfcCodeNotFounded.subunidad}` &&
          item.positionCategory === rfcCodeNotFounded.cat_puesto &&
          item.hours === `${rfcCodeNotFounded.horas}` &&
          item.consecutivePayment === `${rfcCodeNotFounded.cons_plaza}`
        ) {
          rfcErrors.push({ ...item, error: errorMapped['notFoundPaycodeEPC'] });
        }
      });
      rfcSuccess.push(item);
    });
  }
  return {
    rfcErrors,
    rfcSuccess,
  };
};

// ==============================
// Data Processing Functions
// ==============================

const groupByStatus = (data: Awaited<ReturnType<typeof getSiconCapture>>) => {
  const grouped = data.reduce(
    (acc, item) => {
      if (!item.status) {
        throw ErrorApp.badRequest(`El estado del rfc ${item.rfc} no es válido`);
      }

      const statusString = `${item.status}` as StatusAviable;

      if (!statusAviable.includes(statusString)) {
        throw ErrorApp.badRequest(
          'Existen un estatus diferente a 1,4,5,6, el sistema no puede procesarlas, favor de verificarlo.'
        );
      }

      if (item.status === 1 && !item.positionCategory) {
        throw ErrorApp.badRequest(`El rfc ${item.rfc} no tiene categoría de puesto`);
      }

      if (!acc[statusString]) {
        acc[statusString] = [];
      }

      acc[statusString].push(item);
      return acc;
    },
    {
      '1': [],
      '4': [],
      '5': [],
      '6': [],
    } as Record<StatusAviable, RfcSicon>
  );

  return grouped;
};

// ==============================
// Database Operations
// ==============================

const getSiconCapture = async ({ id, fortnight }: GetSiconCaptureI) => {
  // const data = await repository.sicon.refunds.getCaptureByIdOpenClose(id);
  const data = await repository.sicon.refunds.getCaptureByIdOpenClose(423);

  // TODO: ask if close de capture before or after verify this
  if (data.length < 0) {
    throw ErrorApp.badRequest(`No se encontraron datos de captura para la quincena ${fortnight}`);
  }

  return data;
};

const closeVigenRefunds = async ({ fortnight }: CloseVigenRefundsI) => {
  const beforeFortnight = core.fortnight.subtractFortnight(fortnight, 1);

  const [closeVigenByRfc, closeVigenByRfcAndCode] = await Promise.all([
    repository.siapsep.employeePaymentCodeConcept.refunds.closeVigencyByRfc(
      fortnight,
      beforeFortnight
    ),
    repository.siapsep.employeePaymentCodeConcept.refunds.closeVigencyByRfcAndCode(
      fortnight,
      beforeFortnight
    ),
  ]);

  return closeVigenByRfc.count + closeVigenByRfcAndCode.count;
};

const deleteRefunds = async ({ fortnight }: DeleteRefundsI) => {
  const [deleteByRfc, deleteByRfcAndCode] = await Promise.all([
    repository.siapsep.employeePaymentCodeConcept.refunds.deleteByRfc(fortnight),
    repository.siapsep.employeePaymentCodeConcept.refunds.deleteByRfcAndCode(fortnight),
  ]);

  return deleteByRfc.count + deleteByRfcAndCode.count;
};

const deleteInOtherConsecutive = async ({
  statusGrouped,
  fortnight,
}: DeleteInOtherConsecutiveI) => {
  const rfcs = statusGrouped[status.other];
  const deletedInOtherConsecutiveSize = rfcs.length;
  const rfcSuccess: RfcSuccess[] = [];

  if (deletedInOtherConsecutiveSize > 0) {
    const rfcDeleteInOtherConsecutive = rfcs;
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
      ],
      data: rfcs,
    });

    await repository.siapsep.rfcPaymentCodeCalculation.deleteAll();
    await repository.siapsep.rfcPaymentCodeCalculation.createMany(rfcPrepared);
    await repository.siapsep.employeePaymentCodeConcept.refunds.deleteByRfcAndCode(fortnight);

    rfcSuccess.push(...rfcDeleteInOtherConsecutive);
  }

  return rfcSuccess;
};

const createRefunds = async ({ statusGrouped }: CreateRefundsI) => {
  const returnObject = {
    created: 0,
    rfcSuccess: [] as RfcSuccess[],
  };

  if (statusGrouped[status.create].length > 0) {
    const rfcCreateCodePayments = statusGrouped[status.create];
    const columns: PrepareCreateEPCColumn[] = [
      'uVersion',
      'rfc',
      'payCode',
      'unit',
      'subunit',
      'positionCategory',
      'hours',
      'consecutivePayment',
      'conceptType',
      'concept',
      'fortnightEnd',
      'fortnightStart',
      'monthlyAmount',
      'document',
      'documentDate',
      'flag',
      'typeFlag',
      'applicationNumber',
    ];

    const rfcPrepared = core.query.prepareToSQLBulkValues({
      columns,
      data: rfcCreateCodePayments,
    });

    returnObject.created =
      await repository.siapsep.employeePaymentCodeConcept.createMany(rfcPrepared);

    returnObject.rfcSuccess.push(...rfcCreateCodePayments);
  }

  return returnObject;
};

const createRecord = async ({ stats, rfcSuccess, rfcErrors }: CreateRecordI) => {
  const [{ createdId }] = await repository.spn.refunds.createOne(stats);

  if (rfcSuccess.length > 0) {
    await repository.spn.refundRfcSuccess.createMany(
      rfcSuccess.map((item) => ({
        refundLogsId: createdId,
        rfc: item.rfc,
        paymentCode: item.payCode,
        type: statusMapped[`${item.status}` as keyof typeof statusMapped],
      }))
    );
  }

  if (rfcErrors.length > 0) {
    await repository.spn.refundRfcFailed.createMany(
      rfcErrors.map((item) => ({
        refundLogsId: createdId,
        rfc: item.rfc,
        paymentCode: item.payCode,
        type: statusMapped[`${item.status}` as keyof typeof statusMapped],
        error: item.error,
      }))
    );
  }
};

// ==============================
// Helper Functions
// ==============================

const initialStats = (fortnight: number, consecutive: number): RefundLogsCreate => ({
  processFortnight: String(fortnight),
  consecutive,
  userId: '1',
  recordsCreated: 0,
  recordsDeletedResponsabilities: 0,
  recordsDeletedEmployeeConcept: 0,
  recordsClosedTerm: 0,
  recordsSuccesed: 0,
  recordsFailed: 0,
  hasError: false,
  activeBefore: 0,
  activeAfter: 0,
});

const handleEmptyCreateOrCloseRecords = async ({
  stats,
  rfcSuccess,
  rfcErrors,
  statusGrouped,
}: HandleEmptyCreateOrCloseRecordsI) => {
  const createSize = statusGrouped[status.create].length;
  const closeTermSize = statusGrouped[status.close].length;
  let isEmpty = false;

  if (createSize === 0 && closeTermSize === 0) {
    stats.recordsFailed = rfcErrors.length;
    stats.recordsSuccesed = rfcSuccess.length;

    await createRecord({
      stats,
      rfcSuccess,
      rfcErrors,
    });

    isEmpty = true;
  }

  return isEmpty;
};

const getServerFortnights = async () => {
  const initialSiapsep = await controlProcess.cases.getSiapsepInitialData();
  const initialSicon = await refund.cases.getLastConsecutive();

  const siapsepFortnight = initialSiapsep.currentFortnight.fortnight;
  const siconFortnight = initialSicon.siconFortnight.fortnight;
  const spnFortnight = initialSicon.spnFortnight.fortnight;

  // TODO: ask if the correct fortnight is ordinary or current consecutive in SIAPSEP.
  if (siapsepFortnight === 0) {
    throw ErrorApp.badRequest('La quincena del SIAPSEP no es válida o no hay ninguna abierta');
  }

  if (
    !initialSicon.isFirstCharge &&
    initialSicon.areEqualFortnights &&
    initialSicon.spnFortnight.consecutive >= initialSicon.siconFortnight.consecutive
  ) {
    throw ErrorApp.badRequest('El consecutivo registrado en SPN es mayor o igual que en SICON');
  }

  if (spnFortnight > siconFortnight) {
    throw ErrorApp.badRequest('La quincena registrada en SPN es mayor que en SICON');
  }

  // TODO: ask if this is necessary
  if (initialSicon.areEqualFortnights && initialSicon.differencesConsecutive > 1) {
    throw ErrorApp.badRequest('La diferencia de consecutivos es mayor a 1');
  }

  if (siapsepFortnight !== siconFortnight) {
    throw ErrorApp.badRequest('No coinciden las quincenas de SIAPSEP y SICON');
  }

  return {
    siapsep: { fortnight: siapsepFortnight },
    sicon: initialSicon.siconFortnight,
    spn: initialSicon.spnFortnight,
  };
};

// ==============================
// Main Function
// ==============================

export const generateConsecutive = async () => {
  const rfcCalculation = core.rfc.rfc2;

  const fortnights = await getServerFortnights();

  const { fortnight, consecutive } = fortnights.sicon;
  const stats = initialStats(fortnight, consecutive);
  const rfcErrors: RfcError[] = [];
  const rfcSuccess: RfcSuccess[] = [];

  // await closeVigenCapture(fortnights.sicon.id);

  const data = await getSiconCapture(fortnights.sicon);
  let rfcs = [...data];

  const verifiedRfcs = await verifyRfcsExistsInEmployee(rfcCalculation, rfcs);
  rfcErrors.push(...verifiedRfcs.rfcErrors);
  stats.hasError = verifiedRfcs.hasError;
  rfcs = core.rfc.filterRfcs(rfcs, verifiedRfcs.rfcsNotFounded);

  if (rfcs.length === 0) {
    throw ErrorApp.badRequest('No hay registros que procesar');
  }

  const { count: currentRefundsCount } = await getSiapsepCount(fortnight);

  stats.activeBefore = currentRefundsCount;
  stats.activeAfter = currentRefundsCount;

  const statusGrouped = groupByStatus(rfcs);

  stats.recordsDeletedResponsabilities = await repository.siapsep.responsabilities.deleteByRfc(
    rfcCalculation.getTable()
  );
  rfcSuccess.push(...statusGrouped[status.responsabilities]);

  const isEmpty = await handleEmptyCreateOrCloseRecords({
    stats,
    rfcSuccess,
    rfcErrors,
    statusGrouped,
  });

  if (isEmpty) return stats;

  const rfcCodePayments = [...statusGrouped[status.create], ...statusGrouped[status.close]];
  await core.rfcPaymentCode.createRfcPaymentCodeCalculation({ data: rfcCodePayments });

  const closeVigenVerified = await verifyCloseVigen({ statusGrouped, fortnight });
  rfcErrors.push(...closeVigenVerified.rfcErrors);
  rfcSuccess.push(...closeVigenVerified.rfcSuccess);

  stats.recordsClosedTerm = await closeVigenRefunds({ fortnight });
  stats.recordsDeletedEmployeeConcept = await deleteRefunds({ fortnight });

  const rfcsDeleted = await deleteInOtherConsecutive({ statusGrouped, fortnight });
  rfcSuccess.push(...rfcsDeleted);

  const createdRefunds = await createRefunds({ statusGrouped });
  stats.recordsCreated = createdRefunds.created;
  rfcSuccess.push(...createdRefunds.rfcSuccess);

  const lastRefunds = await getSiapsepCount(fortnight);
  stats.activeAfter = lastRefunds.count;
  stats.recordsFailed = rfcErrors.length;
  stats.recordsSuccesed = rfcSuccess.length;
  stats.hasError = rfcErrors.length > 0;

  await createRecord({
    stats,
    rfcSuccess,
    rfcErrors,
  });

  return stats;
};
