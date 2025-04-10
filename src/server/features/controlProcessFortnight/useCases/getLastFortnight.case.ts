import { repository } from '~/server/repositories';

const getLastOrdinaryFortnight = async () => {
  const [ordinary, secondary] = await Promise.all([
    repository.siapsep.controlProcess.getCurrentFortnight(),
    repository.siapsep.controlProcess.getLastSecondaryFortnight(),
  ]);

  const { qna_proc: fortnight, estatus_proc: status } = ordinary;
  const { qna_proc: secondaryFornight } = secondary;

  if (!fortnight || !status) {
    return {
      fortnight: 0,
      status: '',
      error: 'Quincena o estatus de la caratura ordinaria no encontrados',
    };
  }

  if (secondaryFornight && secondaryFornight > fortnight) {
    return { fortnight, status, error: 'Existe una caratula complementaria mayor a la ordinaria' };
  }

  return {
    fortnight,
    status,
  };
};

const getCurrentOpenFortnight = async () => {
  const currentFortnights = await repository.siapsep.controlProcess.getNoClosedFornight();
  const defaultValues = {
    fortnight: 0,
    status: '',
    consecutive: -1,
  };

  if (currentFortnights.length > 1) {
    return {
      error: 'Existen mas de una quincena abierta',
      errorStatus: 401,
      ...defaultValues,
    };
  }

  if (currentFortnights.length === 0) {
    return {
      error: 'No existe ninguna quincena abierta',
      errorStatus: 404,
      ...defaultValues,
    };
  }

  const { qna_proc, estatus_proc, cons_qna_proc } = currentFortnights[0];

  return {
    fortnight: qna_proc ?? 0,
    status: estatus_proc ?? '',
    consecutive: cons_qna_proc ?? -1,
  };
};

export const getSiapsepInitialData = async () => {
  const result = {
    online: true,
    error: '',
  };

  try {
    const [ordinaryFortnight, currentFortnight] = await Promise.all([
      getLastOrdinaryFortnight(),
      getCurrentOpenFortnight(),
    ]);

    return {
      ...result,
      ordinaryFortnight,
      currentFortnight,
    };
  } catch (error) {
    console.log({ error });
    return {
      online: false,
      error: 'Servidor no accesible',
      ordinaryFortnight: {
        fortnight: 0,
        status: '',
      },
      currentFortnight: {
        fortnight: 0,
        status: '',
        consecutive: 0,
      },
    };
  }
};
