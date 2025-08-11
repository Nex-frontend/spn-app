import { refund } from '..';
import { controlProcess } from '../../controlProcessFortnight';
import { ErrorApp } from '~/server/core';
import { repository } from '~/server/repositories';

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

export const generateConsecutive = async () => {
  // 1) Verificar si las quincenas del SIAPSEP Y SICON coincidan
  const fortnights = await getServerFornitghts();

  // 2) Cerrar captura de SICON
  // TODO: lOCAL SICON IS MANDATORY
  // await repository.sicon.refunds.updateStatus(fortnights.sicon.id, 2);

  // 3) Obtener los datos del SICON
  const data = await repository.sicon.refunds.getCaptureByIdOpenClose(fortnights.sicon.id);

  if (data.length < 0) {
    throw ErrorApp.badRequest(
      `No se encontraron datos de captura para la quincena ${fortnights.sicon.fortnight}`
    );
  }

  // TODO: process data

  return await new Promise((resolve) => setTimeout(() => resolve('holi'), 200));
};
