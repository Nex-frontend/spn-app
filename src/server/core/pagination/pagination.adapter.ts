import { and, asc, between, count, desc, eq, gt, gte, ilike, lt, lte, ne, SQL } from 'drizzle-orm';
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core';
import {
  AddPaginateProps,
  CountProps,
  GetFilterSchema,
  GetFiltersProps,
  OrderByProps,
  WithPaginateProps,
} from './pagination.adapter.interface';
import { db } from '~/server/db';
import { refundLogs, user } from '~/server/db/spn/schema';
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

const getOrderBy = ({ schema, order, orderColumn }: OrderByProps) => {
  const fn = order === 'asc' ? asc : desc;

  if (!orderColumn) {
    return fn(schema.id);
  }

  if (typeof orderColumn !== 'string') {
    return orderColumn;
  }

  if (schema.hasOwnProperty(orderColumn)) {
    return fn(schema[orderColumn as keyof typeof schema]! as PgColumn);
  }
  return fn(schema.id);
};

const getFilterSchema = ({ id, schema, joinSchemas }: GetFilterSchema) => {
  if (!id.includes('.')) {
    return {
      currentSchema: schema,
      newId: id,
    };
  }

  const idArray = id.split('.');

  if (idArray.length < 2) {
    throw new Error(`The filter ${id} can't be processed`);
  }

  const [table, field] = idArray;

  if (!joinSchemas?.hasOwnProperty(table)) {
    throw new Error(`Property ${field} don't found in the join`);
  }

  return {
    currentSchema: joinSchemas[table].schema,
    newId: field,
  };
};

const getFilters = ({ filters, filtersFn, schema, joinSchemas }: GetFiltersProps) => {
  const filtersSQL: SQL[] = [];

  if (filters.length === 0) {
    return filtersSQL;
  }

  for (const { value, id } of filters) {
    const { currentSchema, newId } = getFilterSchema({ schema, id, joinSchemas });

    if (!currentSchema.hasOwnProperty(newId)) {
      throw new Error(`Property ${newId} don't found in the table`);
    }

    const column = currentSchema[newId as keyof typeof schema]! as PgColumn;

    const filterFn = filtersFn[id] ?? 'contains';

    if (filterFn === 'between' && Array.isArray(value) && value[0] && value[1]) {
      filtersSQL.push(between(column, value[0], value[1]));
      continue;
    }

    if (typeof value !== 'string') {
      throw new Error(`Value ${value} isn't a valid type`);
    }

    if (!METHODS_FILTER.hasOwnProperty(filterFn)) {
      throw new Error(`Filter ${filterFn} isn't allowed`);
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
    filtersFn = {},
    filters = [],
    order = 'asc',
    orderColumn,
  }: WithPaginateProps
) {
  const orderBy = getOrderBy({ order, schema, orderColumn });
  const filtersSql = getFilters({ filters, filtersFn, schema, joinSchemas });
  const queryPaginated = addPagination({ page, limit, orderColumn: orderBy, qb: query });
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
