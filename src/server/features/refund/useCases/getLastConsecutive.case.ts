import { repository } from '~/server/repositories';
import { ErrorApp } from '~/shared';

interface ConvertFortnightI {
  consecutive: number | null;
  fortnight: string | null;
}

const convertFortnightToNumber = <T extends ConvertFortnightI>(serverFortnight: T) => {
  return {
    ...serverFortnight,
    consecutive: Number(serverFortnight.consecutive),
    fortnight: Number(serverFortnight.fortnight),
  };
};

interface VerifyWarningI {
  areEqualFortnights: boolean;
  differencesConsecutive: number;
  consecutive: number;
}

const verifyWarning = (fortnights: VerifyWarningI) => {
  const { areEqualFortnights, differencesConsecutive, consecutive } = fortnights;

  if ((areEqualFortnights && differencesConsecutive > 1) || differencesConsecutive < 0) {
    return true;
  }

  if (!areEqualFortnights && consecutive !== 1) {
    return true;
  }

  return false;
};

export const getLastConsecutive = async () => {
  const [[siconFortnightPre], [spnFortnightPre]] = await Promise.all([
    repository.sicon.refunds.getLastConsecutive(),
    repository.spn.refunds.getLastConsecutive(),
  ]);

  if (!siconFortnightPre || !siconFortnightPre.fortnight) {
    throw ErrorApp.internal('No se encontraron consecutivos de SICON');
  }

  const siconFortnight = convertFortnightToNumber(siconFortnightPre);

  if (!spnFortnightPre) {
    return {
      siconFortnight,
      spnFortnight: spnFortnightPre,
      warning: 'No se encontro consecutivo en SPN',
      isFirstCharge: true,
      areEqualFortnights: false,
      differencesConsecutive: 0,
    };
  }

  const spnFortnight = convertFortnightToNumber(spnFortnightPre);

  const areEqualFortnights = siconFortnight.fortnight === spnFortnight.fortnight;
  const differencesConsecutive = siconFortnight.consecutive - spnFortnight.consecutive;

  const fortnights = {
    siconFortnight,
    spnFortnight,
    warning: '',
    areEqualFortnights,
    differencesConsecutive,
    isFirstCharge: false,
  };

  const warningIsImportant = verifyWarning({
    areEqualFortnights,
    differencesConsecutive,
    consecutive: siconFortnight.consecutive,
  });

  if (!areEqualFortnights || differencesConsecutive !== 0) {
    const extraText = warningIsImportant && 'La diferencia es mayor a un consecutivo, ¡VERIFICALO!';
    fortnights.warning = `Existe un desfase entre quincenas y consecutivos del SICON (quincena: ${siconFortnight.fortnight}, consecutivo: ${siconFortnight.consecutive})  y SPN (quincena: ${spnFortnight.fortnight}, consecutivo: ${spnFortnight.consecutive}). ${extraText}`;
  }

  return fortnights;
};
