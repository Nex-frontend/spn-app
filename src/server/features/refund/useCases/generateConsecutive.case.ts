import { refund } from '..';
import { controlProcess } from '../../controlProcessFortnight';
import { core } from '~/server/core';
import { repository } from '~/server/repositories';
import { ErrorApp } from '~/shared';

//  ====================================
//  ========== ESTATUS =================
//  ====================================

//  0 - Sin Reintegro
//  1 - Capturado
//  2 - Existe en Empleado Plaza Concepto
//  3 - Existe en Responsabilidades
//  4 - Cierre de vigencia
//  5 - Eliminación de responsabilidades
//  6 - Borrado en otro consecutivo

// const TEST = [
//   {
//     id: 32153,
//     rfc: 'CAMO8907217U6',
//     payCode: '07',
//     unit: '04',
//     subunit: '07',
//     positionCategory: ' S01808',
//     hours: '00.0',
//     consecutivePayment: '200006',
//     conceptType: 'D',
//     concept: '19',
//     fortnightEnd: '202513',
//     fortnightStart: '202513',
//     monthlyAmount: '26979.42',
//     document: 0,
//     documentDate: '2025-07-03 12:21:27',
//     flag: 0,
//     typeFlag: 0,
//     applicationNumber: 0,
//     paymentCode: '070407 S0180800.0200006',
//     biweeklyAmount: '13489.71',
//     status: 1,
//     fortnight: '202513',
//     idUser: 17,
//   },
// ];

const getServerFornitghts = async () => {
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

interface GetSiconCaptureI {
  id: number;
  fortnight: string;
}

const getSiconCapture = async ({ id, fortnight }: GetSiconCaptureI) => {
  // const data = await repository.sicon.refunds.getCaptureByIdOpenClose(id);
  const data = await repository.sicon.refunds.getCaptureByIdOpenClose(423);

  // TODO: ask if close de capture before or after verify this
  if (data.length < 0) {
    throw ErrorApp.badRequest(`No se encontraron datos de captura para la quincena ${fortnight}`);
  }

  return data;
};

const groupByStatus = (data: Awaited<ReturnType<typeof getSiconCapture>>) => {
  const grouped = data.reduce(
    (acc, item) => {
      if (!item.status) {
        throw ErrorApp.badRequest(`El estado del rfc ${item.rfc} no es válido`);
      }

      if (item.status === 3 || item.status === 2) {
        throw ErrorApp.badRequest(
          'Existen estatus 2 y/o 3, el sistema no puede procesarlas, favor de verificarlo.'
        );
      }

      if (item.status === 1 && !item.positionCategory) {
        throw ErrorApp.badRequest(`El rfc ${item.rfc} no tiene categoría de puesto`);
      }

      const statusString = `${item.status}`;

      if (!acc[statusString]) {
        acc[statusString] = [];
      }
      acc[statusString].push(item);
      return acc;
    },
    {} as Record<string, typeof data>
  );

  return grouped;
};

const filterRfcs = (
  data: Awaited<ReturnType<typeof getSiconCapture>>,
  rfcNotFounded: { rfc: string }[]
) => {
  const rfcNotFoundedSet = new Set(rfcNotFounded.map((item) => item.rfc));
  return data.filter((item) => !rfcNotFoundedSet.has(item.rfc));
};

// const separateEmptyCodePayment = (data: Awaited<ReturnType<typeof getSiconCapture>>) => {};

export const generateConsecutive = async () => {
  const status = {
    create: '1',
    close: '4',
    responsabilities: '5',
    other: '6',
  };

  const stats = {
    respDeleted: 0,
  };

  const rfcCalculation = core.rfc.rfc2;

  const fortnights = await getServerFornitghts();

  // TODO: lOCAL SICON IS MANDATORY
  // await repository.sicon.refunds.updateStatus(fortnights.sicon.id, 2);

  const { fortnight } = fortnights.sicon;

  const data = await getSiconCapture(fortnights.sicon);
  let rfcs = [...data];
  // Agregar RFC unicos en rfc_calculo
  const rfcUniques = core.rfc.groupByRFCtoSQL(rfcs);
  await rfcCalculation.insertRFCs(rfcUniques);

  const rfcsNotFounded = await rfcCalculation.getRfcNotInEmployee();

  if (rfcsNotFounded.length > 0) {
    await rfcCalculation.deleteRfcNotInEmployee();
    rfcs = filterRfcs(rfcs, rfcsNotFounded);
  }

  if (rfcs.length === 0) {
    // TODO: Set stats with real data
    return stats;
  }

  // TODO: eliminar de responsabilidades
  // const respDeleted = await repository.siapsep.responsabilities.deleteByRfc('rfc2');

  // stats.respDeleted = respDeleted;
  const statusGrouped = groupByStatus(rfcs);

  const createSize = statusGrouped[status.create]?.length ?? 0;
  const closeTermSize = statusGrouped[status.close]?.length ?? 0;
  // const deleteResponsabilitiesSize = statusGrouped['5']?.length ?? 0;

  if (createSize === 0 && closeTermSize === 0) {
    return stats;
  }

  const rfcCodePayments = [
    ...(statusGrouped[status.create] ?? []),
    ...(statusGrouped[status.close] ?? []),
  ];

  const rfcPrepared = core.rfc.prepareToSQLBulkValues({
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
    data: rfcCodePayments,
  });

  // console.log(rfcPrepared);

  await repository.siapsep.rfcPaymentCodeCalculation.deleteAll();
  await repository.siapsep.rfcPaymentCodeCalculation.createMany(rfcPrepared);

  const currentRefunds =
    await repository.siapsep.employeePaymentCodeConcept.refunds.getCount(fortnight);

  const rfcNotEPC =
    await repository.siapsep.rfcPaymentCodeCalculation.refunds.getRfcNotEPC(fortnight);

  const rfcPaymentCodeNotEPC =
    await repository.siapsep.rfcPaymentCodeCalculation.refunds.getRfcPaymentCodeNotEPC(fortnight);

  const closeVigenByRfc =
    await repository.siapsep.employeePaymentCodeConcept.refunds.closeVigencyByRfc(
      fortnight,
      fortnight - 1
    );

  const closeVigenByRfcAndCode =
    await repository.siapsep.employeePaymentCodeConcept.refunds.closeVigencyByRfcAndCode(
      fortnight,
      fortnight - 1
    );

  const deleteByRfc =
    await repository.siapsep.employeePaymentCodeConcept.refunds.deleteByRfc(fortnight);

  const deleteByRfcAndCode =
    await repository.siapsep.employeePaymentCodeConcept.refunds.deleteByRfcAndCode(fortnight);

  if (statusGrouped[status.create]?.length > 0) {
    const toInsertEPC = core.rfc.prepareToSQLBulkValues({
      columns: [
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
      ],
      data: statusGrouped[status.create],
    });

    const created = await repository.siapsep.employeePaymentCodeConcept.createMany(toInsertEPC);
  }

  const lastRefunds =
    await repository.siapsep.employeePaymentCodeConcept.refunds.getCount(fortnight);
  // console.log({
  //   currentRefunds,
  //   rfcNotEPC,
  //   rfcPaymentCodeNotEPC,
  // });

  return 'holi';
};
