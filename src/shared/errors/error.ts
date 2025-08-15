import { ErrorApp } from './errorApp.entity';

export const handlerError = (error: unknown) => {
  if (error instanceof AggregateError) {
    return ErrorApp.internal('Error en la conexión');
  }

  if (error instanceof ErrorApp) {
    return error;
  }

  return ErrorApp.internal('Ocurrio un error sin manejar, favor de contactar al administrador.');
};
