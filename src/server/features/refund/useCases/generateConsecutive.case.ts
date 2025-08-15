import { refund } from '..';
import { controlProcess } from '../../controlProcessFortnight';
import { core } from '~/server/core';
import { repository } from '~/server/repositories';
import { ErrorApp } from '~/shared';

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

      if (!acc[item.status]) {
        acc[item.status] = [];
      }
      acc[item.status].push(item);
      return acc;
    },
    {} as Record<number, typeof data>
  );

  return grouped;
};

export const generateConsecutive = async () => {
  // 1) Verificar si las quincenas del SIAPSEP Y SICON coincidan
  const fortnights = await getServerFornitghts();

  // 2) Cerrar captura de SICON
  // TODO: lOCAL SICON IS MANDATORY
  // await repository.sicon.refunds.updateStatus(fortnights.sicon.id, 2);

  // 3) Obtener los datos del SICON
  const data = await getSiconCapture(fortnights.sicon);
  console.log(data);

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

  // TODO: process data
  //   id: 32133,
  //   rfc: 'AUPM720530IW2',
  //   plaza: '075014  E278130.0040184',
  //   fortnightStart: '202510',
  //   fortnightEnd: '202512',
  //   monthlyAmount: '231.29',
  //   biweeklyAmount: '115.64',
  //   status: 5,
  //   fortnight: '202513',
  //   idUser: 17

  // TODO: group by status

  const statusGrouped = groupByStatus(data);
  const rfcGrouped = core.rfc.groupByRFCtoSQL(data);

  // return await new Promise((resolve) => setTimeout(() => resolve('holi'), 0));
  return 'holi';
};
