import { ErrorApp } from '~/shared';

type NonNullableBulk<T> = T extends null ? never : T;

interface PrepareToSQLBulkValuesI<T extends object, K extends keyof T = keyof T> {
  columns: K[];
  data: T[];
  withoutNull?: boolean;
}

export const prepareToSQLBulkValues = <T extends object, K extends keyof T = keyof T>({
  columns,
  data,
  withoutNull,
}: PrepareToSQLBulkValuesI<T, K>) => {
  return data.map((item) =>
    columns.map((column) => {
      const columnString = String(column);

      if (!(column in item)) {
        throw ErrorApp.badRequest(`La columna ${columnString} no existe en el registro`);
      }
      if (withoutNull && item[column] === null) {
        throw ErrorApp.badRequest(`La columna ${columnString} no puede ser nula`);
      }

      const value = item[column];

      if (typeof value !== 'string' && typeof value !== 'number' && value !== null) {
        throw ErrorApp.badRequest(`La columna ${String(column)} tiene un tipo de dato invalido`);
      }
      // Si withoutNull es true, el tipo será NonNullableBulk<T>
      return withoutNull ? (value as NonNullableBulk<typeof value>) : value;
    })
  );
};
