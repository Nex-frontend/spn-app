import { and, asc, between, count, desc, eq, gt, gte, like, lt, lte, ne, SQL } from 'drizzle-orm';
import { AnyPgSelect, PgColumn, pgEnum, PgSelect, PgTable } from 'drizzle-orm/pg-core';
import { controlSiconQueries } from '~/features/controlSicon';
import { db } from '~/server/db';
import { refundLogs, user } from '~/server/db/spn/schema';

type SchemaI = PgTable & { id: PgColumn };
type OrderColumnI = PgColumn | SQL | SQL.Aliased | string;
type Order = 'asc' | 'desc';

interface WithPaginateProps {
  schema: SchemaI;
  limit: number;
  page: number;
  filters: SQL[];
  orderColumn?: OrderColumnI;
  order: Order;
}

type OrderByProps = Pick<WithPaginateProps, 'order' | 'orderColumn' | 'schema'>;
type CountProps = Pick<WithPaginateProps, 'schema' | 'filters'>;

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

const getPagination = ({
  schema,
  limit,
  page,
  orderColumn,
  filters = [],
  order = 'asc',
}: WithPaginateProps) => {
  const offset = page <= 0 || limit <= 0 ? 0 : page * limit;
  const orderBy = getOrderBy({ schema, order, orderColumn });

  return db.spn
    .select({ id: schema.id })
    .from(schema)
    .where(and(...filters))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)
    .as('subquery');
};

const getCount = async ({ schema, filters = [] }: CountProps) => {
  return await db.spn
    .select({ count: count() })
    .from(schema)
    .where(and(...filters));
};
type FilterI = {
  id: string;
  value: unknown;
}[];

type FilterFnI = {
  [x: string]: string;
};

interface Props {
  schema: SchemaI;
  limit: number;
  page: number;
  // filters?: SQL[];
  orderColumn?: OrderColumnI;
  order?: Order;
  filters?: FilterI;
  filtersFn?: FilterFnI;
}

// El deferred paginated se hace despues de todo el query, lo que puede ocasionar problemas
//  de rendimientos en tablas con muchos joins antes de la paginacion
//  No se intento buscar una solución por que aun no aparece el problema
// En caso de aparecer se tiene que refactorizar este metodo withPagination
export async function withPagination<T extends PgSelect>(
  query: T,
  { page, limit, schema, filtersFn = {}, filters = [], order = 'asc', orderColumn }: Props
) {
  //   return query.limit(limit).offset((page - 1) * limit);
  const filtersSql = getFilters({ filters, filtersFn, schema });

  const pagination = getPagination({
    page,
    limit,
    schema,
    filters: filtersSql,
    order,
    orderColumn,
  });
  const orderBy = getOrderBy({ order, schema, orderColumn });
  // TODO: Do filters options
  const queryPaginated = query.innerJoin(pagination, eq(schema.id, pagination.id)).orderBy(orderBy);
  //   const extra = querycito;
  // const extra = withUsers(querycito);
  const [data, total] = await Promise.all([
    queryPaginated,
    getCount({ schema, filters: filtersSql }),
  ]);

  return {
    data,
    meta: {
      totalRowCount: total[0].count,
    },
  };
  //   return query.limit(10);
  //   return queryWithPagination.orderBy(asc(schema.id));
}

interface GetFiltersI {
  filters: FilterI;
  filtersFn: FilterFnI;
  schema: SchemaI;
}

// filter :  { id: '', value: ''}
interface GetFilterFnI {
  id: string;
  filtersFn: FilterFnI;
}

const methods = {
  equals: eq,
  notEquals: ne,
  greaterThan: gt,
  lessThan: lt,
  greaterThanOrEqualTo: gte,
  lessThanOrEqualTo: lte,
};

const getFilters = ({ filters, filtersFn, schema }: GetFiltersI) => {
  const filtersSQL: SQL[] = [];

  if (filters.length === 0) {
    return filtersSQL;
  }

  for (const { value, id } of filters) {
    if (!schema.hasOwnProperty(id)) {
      continue;
    }

    const column = schema[id as keyof typeof schema]! as PgColumn;

    const filterFn = filtersFn[id] ?? 'contains';
    // const methodSql = methods[filterFn] ?? like;

    // BETWEEN
    if (filterFn === 'between' && Array.isArray(value) && value[0] && value[1]) {
      filtersSQL.push(between(column, value[0], value[1]));
      continue;
    }

    if (typeof value !== 'string') {
      continue;
    }

    if (filterFn === 'endsWith') {
      filtersSQL.push(like(column, `%${value}`));
      continue;
    }

    if (filterFn === 'startsWith') {
      filtersSQL.push(like(column, `${value}%`));
      continue;
    }

    if (filterFn === 'contains') {
      filtersSQL.push(like(column, `%${value}%`));
      continue;
    }

    if (!methods.hasOwnProperty(filterFn)) {
      throw new Error('Se especifico un filtro no permitido');
    }

    filtersSQL.push(methods[filterFn as keyof typeof methods](column, value));
  }

  return filtersSQL;
};
