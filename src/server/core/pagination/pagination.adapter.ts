import { and, asc, between, count, desc, eq, SQL } from 'drizzle-orm';
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core';
import { ErrorApp } from '../errors';
import {
  AddFilterByColumnProps,
  AddPaginateProps,
  CountProps,
  GetFilterSchema,
  GetFiltersProps,
  OrderByProps,
  WithPaginateProps,
} from './pagination.adapter.interface';
import { dateFilterMap, methodsFilterMap } from './pagination.mapper';
import { db } from '~/server/db';
import { isEmpty } from '~/shared';

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

const getFilterSchema = ({ id, schema, joinSchemas = {} }: GetFilterSchema) => {
  if (!id.includes('.')) {
    return {
      currentSchema: schema,
      columnName: id,
    };
  }

  const idArray = id.split('.');

  if (idArray.length < 2) {
    throw new Error(`El filtro ${id} no puede ser procesado`);
  }

  const [table, columnName] = idArray;

  if (!(table in joinSchemas)) {
    throw new Error(`La tabla ${table} no existe en la consulta`);
  }

  if (!(columnName in joinSchemas[table].schema)) {
    throw new Error(`La propiedad ${columnName} no se encontró en la consulta`);
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

    if (!(columnName in currentSchema)) {
      throw ErrorApp.badRequest(`La columna ${columnName} no se encontró en la consulta`);
    }

    const column = currentSchema[columnName as keyof typeof schema]! as PgColumn;
    const filterFn = getFilterFn(column, filtersFn[id]);

    if (filterFn === 'between' && Array.isArray(value)) {
      if (!value[0] || !value[1]) continue;

      const { start, end } = getBetweenData(column, value);
      filtersSQL.push(between(column, start, end));
      continue;
    }

    if (typeof value !== 'string') {
      throw ErrorApp.badRequest(`El valor ${value} no es un tipo válido`);
    }

    if (column.dataType === 'boolean') {
      const booleanValue = value === 'true';
      filtersSQL.push(methodsFilterMap['equals'](column, booleanValue));
      continue;
    }

    if (column.dataType === 'date') {
      const dateFilter = addDateFilter({ column, value, filterFn });
      filtersSQL.push(dateFilter);
      continue;
    }

    if (!(filterFn in methodsFilterMap)) {
      throw ErrorApp.badRequest(
        `El filtro ${filterFn} no está permitido para la columna ${columnName}`
      );
    }

    filtersSQL.push(methodsFilterMap[filterFn as keyof typeof methodsFilterMap](column, value));
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

const getDateRange = (startDate: string, endDate: string) => {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T23:59:59.999Z`);
  return { start, end };
};

const getBetweenData = (column: PgColumn, values: string[]) => {
  if (column.dataType === 'date') {
    return getDateRange(values[0], values[1]);
  }

  return { start: values[0], end: values[1] };
};

const addDateFilter = ({ column, value, filterFn }: AddFilterByColumnProps) => {
  const { start, end } = getDateRange(value, value);

  if (!(filterFn in dateFilterMap)) {
    throw ErrorApp.badRequest(`El filtro ${filterFn} no está permitido para el tipo de dato fecha`);
  }

  return dateFilterMap[filterFn as keyof typeof dateFilterMap](column, start, end);
};

const getFilterFn = (column: PgColumn, filterFn?: string) => {
  if (column.dataType !== 'string' && (filterFn === 'contains' || !filterFn)) return 'equals';

  if (!filterFn) return 'contains';

  return filterFn;
};
