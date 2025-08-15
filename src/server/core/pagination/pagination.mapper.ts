import { between, eq, gt, gte, ilike, lt, lte, ne, notBetween, SQL } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';
import { ErrorApp } from '../../../shared/errors';
import { DateFilterMap, MethodsFilterMap } from './pagination.service.interface';

// MOVE THIS METHODS IF IS NECESSARY IN CORE
const endsWith = (column: PgColumn, value: unknown) => {
  return ilike(column, `%${value}`);
};

const startsWith = (column: PgColumn, value: unknown) => {
  return ilike(column, `${value}%`);
};

const contains = (column: PgColumn, value: unknown) => {
  return ilike(column, `%${value}%`);
};

const validateType = (column: PgColumn, value: unknown) => {
  const validator = validTypesMap[column.dataType];
  if (validator) {
    validator(value);
  }
};

const getValidatedSQLMethods = (
  column: PgColumn,
  value: unknown,
  fn: (column: PgColumn, value: unknown) => SQL
): SQL => {
  validateType(column, value);

  return fn(column, value);
};

export const validTypesMap: Record<string, (value: unknown) => void> = {
  number: (value) => {
    if (isNaN(Number(value)))
      throw ErrorApp.badRequest(`El valor "${value}" no es un número válido`);
  },
  date: (value) => {
    if (!(value instanceof Date))
      throw ErrorApp.badRequest(`El valor "${value}" no es una fecha válida`);
  },
  boolean: (value) => {
    if (typeof value !== 'boolean')
      throw ErrorApp.badRequest(`El valor "${value}" no es un booleano válido`);
  },
};

export const methodsFilterMap: MethodsFilterMap = {
  endsWith,
  startsWith,
  contains,
  equals: (column, value) => getValidatedSQLMethods(column, value, eq),
  notEquals: (column, value) => getValidatedSQLMethods(column, value, ne),
  greaterThan: (column, value) => getValidatedSQLMethods(column, value, gt),
  lessThan: (column, value) => getValidatedSQLMethods(column, value, lt),
  greaterThanOrEqualTo: (column, value) => getValidatedSQLMethods(column, value, gte),
  lessThanOrEqualTo: (column, value) => getValidatedSQLMethods(column, value, lte),
};

export const dateFilterMap: DateFilterMap = {
  contains: (column, start, end) => between(column, start, end),
  equals: (column, start, end) => between(column, start, end),
  notEquals: (column, start, end) => notBetween(column, start, end),
  greaterThan: (column, _, end) => gt(column, end),
  greaterThanOrEqualTo: (column, start) => gte(column, start),
  lessThan: (column, start) => lt(column, start),
  lessThanOrEqualTo: (column, _, end) => lte(column, end),
};
