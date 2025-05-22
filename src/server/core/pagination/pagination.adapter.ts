import { and, asc, between, count, desc, eq, gt, gte, ilike, lt, lte, ne, SQL } from 'drizzle-orm';
import { MySqlColumnWithAutoIncrement } from 'drizzle-orm/mysql-core';
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core';
import { ErrorApp } from '../errors';
import {
  AddPaginateProps,
  CountProps,
  GetFilterSchema,
  GetFiltersProps,
  OrderByProps,
  WithPaginateProps,
} from './pagination.adapter.interface';
import { db } from '~/server/db';
import { isEmpty } from '~/shared';

// MOVE THIS METHODS IF IS NECESSARY IN CORE
const endsWith = (column: PgColumn, value: string | Date) => {
  return ilike(column, `%${value}`);
};

const startsWith = (column: PgColumn, value: string | Date) => {
  return ilike(column, `${value}%`);
};

const contains = (column: PgColumn, value: string | Date) => {
  return ilike(column, `%${value}%`);
};

const METHODS_FILTER = {
  endsWith,
  startsWith,
  contains,
  equals: eq,
  notEquals: ne,
  greaterThan: gt,
  lessThan: lt,
  greaterThanOrEqualTo: gte,
  lessThanOrEqualTo: lte,
};

const getOrderBy = ({ schema, order, orderBy, joinSchemas }: OrderByProps) => {
  const fn = order === 'asc' ? asc : desc;

  if (!orderBy) {
    return fn(schema.id);
  }

  if (typeof orderBy !== 'string') {
    return orderBy;
  }

  const { currentSchema, columnName } = getFilterSchema({ id: orderBy, schema, joinSchemas });
  return fn(currentSchema[columnName as keyof typeof currentSchema]! as PgColumn);
};

const getFilterSchema = ({ id, schema, joinSchemas }: GetFilterSchema) => {
  if (!id.includes('.')) {
    return {
      currentSchema: schema,
      columnName: id,
    };
  }

  const idArray = id.split('.');

  if (idArray.length < 2) {
    throw new Error(`The filter ${id} can't be processed`);
  }

  const [table, columnName] = idArray;

  if (!joinSchemas?.hasOwnProperty(table)) {
    throw new Error(`Table ${table} don't found in the join`);
  }

  if (!joinSchemas[table].schema?.hasOwnProperty(columnName)) {
    throw new Error(`Property ${columnName} don't found in the join`);
  }

  return {
    currentSchema: joinSchemas[table].schema,
    columnName,
  };
};

const getFilters = ({ filters, filtersFn, schema, joinSchemas }: GetFiltersProps) => {
  const filtersSQL: SQL[] = [];

  if (filters.length === 0) {
    return filtersSQL;
  }

  for (const { value, id } of filters) {
    const { currentSchema, columnName } = getFilterSchema({ schema, id, joinSchemas });

    if (!currentSchema.hasOwnProperty(columnName)) {
      throw ErrorApp.badRequest(`Property ${columnName} don't found in the table`);
    }

    const column = currentSchema[columnName as keyof typeof schema]! as PgColumn;

    const filterFn = filtersFn[id] ?? 'contains';

    // console.log({ column, filterFn });

    if (filterFn === 'between' && Array.isArray(value)) {
      if (!value[0] || !value[1]) continue;

      if (column.dataType === 'date') {
        const start = new Date(`${value[0]}T00:00:00.000Z`);
        const end = new Date(`${value[1]}T23:59:59.999Z`);

        filtersSQL.push(between(column, start, end));
        continue;
      }

      filtersSQL.push(between(column, value[0], value[1]));
      continue;
    }

    if (typeof value !== 'string') {
      // throw ErrorApp.badRequest(`Value ${value} isn't a valid type`);
      continue;
    }

    if (column.dataType === 'boolean') {
      const booleanValue = value === 'true';
      filtersSQL.push(METHODS_FILTER['equals'](column, booleanValue));
      continue;
    }

    if (column.dataType === 'date') {
      const start = new Date(`${value}T00:00:00.000Z`);
      const end = new Date(`${value}T23:59:59.999Z`);

      if (filterFn === 'contains' || filterFn === 'equals') {
        console.log({ start, end, value });
        filtersSQL.push(between(column, start, end));
        continue;
      }
      if (filterFn === 'greaterThan') {
        // Si el usuario da solo la fecha, compara con el inicio del día siguiente
        const nextDay = new Date(value);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        filtersSQL.push(gt(column, nextDay));
        continue;
      }
    }

    const castedValue = column.dataType === 'date' ? new Date(value) : value;
    const castedFilterFn =
      column.dataType === 'date' && filterFn === 'contains' ? 'equals' : filterFn;

    if (!METHODS_FILTER.hasOwnProperty(castedFilterFn)) {
      throw ErrorApp.badRequest(`Filter ${castedFilterFn} isn't allowed`);
    }

    filtersSQL.push(
      METHODS_FILTER[castedFilterFn as keyof typeof METHODS_FILTER](column, castedValue)
    );
  }

  return filtersSQL;
};

const getCount = async ({ schema, filters = [], joinSchemas = {} }: CountProps) => {
  const query = db.spn.select({ count: count() }).from(schema).$dynamic();

  if (isEmpty(joinSchemas)) {
    return await query.where(and(...filters));
  }

  for (const key in joinSchemas) {
    const { schema, fieldJoin, fieldFrom, type } = joinSchemas[key];
    query[type](schema, eq(fieldFrom, fieldJoin));
  }

  return await query.where(and(...filters));
};

const addPagination = <T extends PgSelect>({
  qb,
  orderColumn,
  limit,
  page,
}: AddPaginateProps<T>) => {
  const offset = page <= 0 || limit <= 0 ? 0 : page * limit;
  return qb.orderBy(orderColumn).limit(limit).offset(offset);
};

//  Se intento con defered pagination pero se estaba complicando con
// Filtros de otras tamblas con left joins
//  se retomo la paginacion tradicional
// EN dado caso de teener problemas de rendimiento mas adelante
//  se podria modificar withPagination
export async function withPagination<T extends PgSelect>(
  query: T,
  {
    page,
    limit,
    schema,
    joinSchemas,
    orderBy,
    filtersFn = {},
    filters = [],
    order = 'asc',
  }: WithPaginateProps
) {
  // console.log({ filtersFn });
  const orderByFn = getOrderBy({ order, schema, orderBy, joinSchemas });
  const filtersSql = getFilters({ filters, filtersFn, schema, joinSchemas });

  // console.log(filtersSql);
  const queryPaginated = addPagination({ page, limit, orderColumn: orderByFn, qb: query });
  const queryFiltered = queryPaginated.where(and(...filtersSql));

  const [data, total] = await Promise.all([
    queryFiltered,
    getCount({ schema, filters: filtersSql, joinSchemas }),
  ]);

  return {
    data,
    meta: {
      totalRowCount: total[0].count,
    },
  };
}
