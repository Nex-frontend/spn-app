import { and, asc, between, count, desc, eq, gt, gte, ilike, lt, lte, ne, SQL } from 'drizzle-orm';
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
const endsWith = (column: PgColumn, value: string) => {
  return ilike(column, `%${value}`);
};

const startsWith = (column: PgColumn, value: string) => {
  return ilike(column, `${value}%`);
};

const contains = (column: PgColumn, value: string) => {
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
    console.log('no orderCOlumn');
    return fn(schema.id);
  }

  if (typeof orderBy !== 'string') {
    return orderBy;
  }

  console.log({ joinSchemas });

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

    if (filterFn === 'between' && Array.isArray(value) && value[0] && value[1]) {
      filtersSQL.push(between(column, value[0], value[1]));
      continue;
    }

    if (typeof value !== 'string') {
      throw ErrorApp.badRequest(`Value ${value} isn't a valid type`);
    }

    if (!METHODS_FILTER.hasOwnProperty(filterFn)) {
      throw ErrorApp.badRequest(`Filter ${filterFn} isn't allowed`);
    }

    filtersSQL.push(METHODS_FILTER[filterFn as keyof typeof METHODS_FILTER](column, value));
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
  const orderByFn = getOrderBy({ order, schema, orderBy, joinSchemas });
  const filtersSql = getFilters({ filters, filtersFn, schema, joinSchemas });
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
