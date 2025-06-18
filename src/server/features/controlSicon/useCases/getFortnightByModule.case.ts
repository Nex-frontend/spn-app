import { repository } from '~/server/repositories';

const getErrorResponse = (error: string) => ({
  online: false,
  error,
  module: {
    id: 0,
    fortnight: '',
    status: '',
    name: '',
  },
});

export const getFortnightByModule = async (moduleName: string = 'cargar_tablas') => {
  try {
    const siconModule = await repository.sicon.modules.getFortnightByModule(moduleName);

    if (siconModule.length === 0) {
      return getErrorResponse(`No se encontro el módulo de ${moduleName.replace('_', ' ')}`);
    }

    return {
      online: true,
      error: '',
      module: { ...siconModule[0] },
    };
  } catch (error) {
    console.log({ errorSicon: error });
    return getErrorResponse('Servidor no accesible');
  }
};
