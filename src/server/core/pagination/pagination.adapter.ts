import { and, asc, count, desc, eq, SQL } from 'drizzle-orm';
import { AnyPgSelect, PgColumn, pgEnum, PgSelect, PgTable } from 'drizzle-orm/pg-core';
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

const data = async () => {
  const query = db.spn
    .select({
      user: user.id,
    })
    .from(refundLogs)
    .leftJoin(user, eq(refundLogs.userId, user.id))
    .$dynamic();

  //   const test = await withPagination(query);
  //   const test = await withPagination(query, {
  //     page: 1,
  //     limit: 10,
  //     schema: refundLogs,
  //     extraQuery: (q: PgSelect) => {
  //       return q.leftJoin(user, eq(refundLogs.userId, user.id));
  //     },
  //   });

  const mys = await withPagination(query, {
    page: 1,
    limit: 10,
    schema: refundLogs,
    // extraQuery: withUsers,
  });
  //   test.
};

function withUsers<T extends PgSelect>(qb: T) {
  return qb.leftJoin(user, eq(refundLogs.userId, user.id));
}

interface Props {
  schema: SchemaI;
  limit: number;
  page: number;
  filters?: SQL[];
  orderColumn?: OrderColumnI;
  order?: Order;
}

// El deferred paginated se hace despues de todo el query, lo que puede ocasionar problemas
//  de rendimientos en tablas con muchos joins antes de la paginacion
//  No se intento buscar una solución por que aun no aparece el problema
// En caso de aparecer se tiene que refactorizar este metodo withPagination
async function withPagination<T extends PgSelect>(
  query: T,
  { page, limit, schema, filters = [], order = 'asc', orderColumn }: Props
) {
  //   return query.limit(limit).offset((page - 1) * limit);
  const pagination = getPagination({ page, limit, schema, filters, order });
  const orderBy = getOrderBy({ order, schema, orderColumn });
  const queryPaginated = query.innerJoin(pagination, eq(schema.id, pagination.id)).orderBy(orderBy);
  //   const extra = querycito;
  // const extra = withUsers(querycito);
  const [data, total] = await Promise.all([queryPaginated, getCount({ schema, filters })]);

  return { data, total };
  //   return query.limit(10);
  //   return queryWithPagination.orderBy(asc(schema.id));
}
