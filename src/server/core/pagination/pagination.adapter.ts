import { and, asc, between, count, desc, eq, gt, gte, like, lt, lte, ne, SQL } from 'drizzle-orm';
import { AnyPgSelect, PgColumn, pgEnum, PgSelect, PgTable } from 'drizzle-orm/pg-core';
import { controlSiconQueries } from '~/features/controlSicon';
import { db } from '~/server/db';
import { refundLogs, user } from '~/server/db/spn/schema';
import { isEmpty } from '~/shared';

type SchemaI = PgTable & { id: PgColumn };
type OrderColumnI = PgColumn | SQL | SQL.Aliased | string;
type OrderColumnP = PgColumn | SQL | SQL.Aliased;
type Order = 'asc' | 'desc';

interface WithPaginateProps {
  schema: SchemaI;
  limit: number;
  page: number;
  filters: SQL[];
  orderColumn?: OrderColumnI;
  order: Order;
}

interface AddPaginateProps<T extends PgSelect> {
  qb: T;
  limit: number;
  page: number;
  orderColumn: OrderColumnP;
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

const addPagination = <T extends PgSelect>({
  qb,
  orderColumn,
  limit,
  page,
}: AddPaginateProps<T>) => {
  const offset = page <= 0 || limit <= 0 ? 0 : page * limit;
  return qb.orderBy(orderColumn).limit(limit).offset(offset);
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

type JoinSchemas = Record<string, SchemaI>;

interface Props {
  schema: SchemaI;
  limit: number;
  page: number;
  joinSchemas?: JoinSchemas;
  orderColumn?: OrderColumnI;
  order?: Order;
  filters?: FilterI;
  filtersFn?: FilterFnI;
}

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
  }: Props
) {
  const orderBy = getOrderBy({ order, schema, orderColumn });
  const filtersSql = getFilters({ filters, filtersFn, schema: user, joinSchemas });
  const queryPaginated = addPagination({ page, limit, orderColumn: orderBy, qb: query });
  const queryFiltered = queryPaginated.where(and(...filtersSql));

  const [data, total] = await Promise.all([
    queryFiltered,
    getCount({ schema: user, filters: filtersSql }),
  ]);

  return {
    data,
    meta: {
      totalRowCount: total[0].count,
    },
  };
}

interface GetFiltersI {
  filters: FilterI;
  filtersFn: FilterFnI;
  schema: SchemaI;
  joinSchemas?: JoinSchemas;
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

const getFilters = ({ filters, filtersFn, schema, joinSchemas }: GetFiltersI) => {
  const filtersSQL: SQL[] = [];

  //  user.name
  //  joinsSchema = { user: user<Schema>}

  if (filters.length === 0) {
    return filtersSQL;
  }

  for (const { value, id } of filters) {
    let currentSchema = schema;
    let newId = id;

    // TODO: Refactor this with a custom method called getJoinSchema o something like that
    if (id.includes('.')) {
      const idArray = id.split('.');

      if (idArray.length < 2) {
        throw new Error(`The filter ${id} can't be processed`);
      }

      const [table, field] = idArray;

      if (!joinSchemas?.hasOwnProperty(table)) {
        throw new Error(`Property ${field} don't found in the join`);
      }

      currentSchema = joinSchemas[table];
      newId = field;
    }

    if (!currentSchema.hasOwnProperty(newId)) {
      throw new Error(`Property ${newId} don't found in the table`);
    }

    const column = currentSchema[newId as keyof typeof schema]! as PgColumn;

    const filterFn = filtersFn[id] ?? 'contains';
    // const methodSql = methods[filterFn] ?? like;

    // BETWEEN
    if (filterFn === 'between' && Array.isArray(value) && value[0] && value[1]) {
      filtersSQL.push(between(column, value[0], value[1]));
      continue;
    }

    if (typeof value !== 'string') {
      throw new Error(`Value ${value} isn't a valid type`);
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
      throw new Error(`Filter ${filterFn} isn't allowed`);
    }

    filtersSQL.push(methods[filterFn as keyof typeof methods](column, value));
  }

  return filtersSQL;
};
