import { and, asc, count, desc, eq, SQL } from 'drizzle-orm';
import { PgColumn, PgSelect, PgTable } from 'drizzle-orm/pg-core';
import { db } from '~/server/db';
import { refundLogs, user } from '~/server/db/spn/schema';

interface WithPaginationProps<T extends PgSelect> {
  qb: T;
  orderByColumn: PgColumn | SQL | SQL.Aliased;
  page?: number;
  limit?: number;
}

const withPagination = ({
  qb,
  orderByColumn,
  page = 1,
  limit = 10,
}: WithPaginationProps<PgSelect>) => {
  const offset = page <= 0 || limit <= 0 ? 0 : (page - 1) * limit;
  return qb.orderBy(orderByColumn).limit(limit).offset(offset);
};

interface OrderByProps {
  schema: PgTable & { id: PgColumn };
  order: 'asc' | 'desc';
  column?: PgColumn | SQL | SQL.Aliased | string;
}

const getOrderBy = ({ schema, order, column }: OrderByProps) => {
  const fn = order === 'asc' ? asc : desc;

  if (!column) {
    return fn(schema.id);
  }

  if (typeof column !== 'string') {
    return column;
  }

  if (schema.hasOwnProperty(column)) {
    return fn(schema[column as keyof typeof schema]! as PgColumn);
  }

  return fn(schema.id);
};

interface PaginateProps {
  limit: number;
  page: number;
}

interface WithPaginateProps {
  schema: PgTable & { id: PgColumn };
  limit: number;
  page: number;
  filters: SQL[];
  orderByColumn?: PgColumn | SQL | SQL.Aliased | string;
  order: 'asc' | 'desc';
}

const getPagination = ({
  schema,
  limit,
  page,
  filters = [],
  orderByColumn,
  order = 'asc',
}: WithPaginateProps) => {
  const offset = page <= 0 || limit <= 0 ? 0 : page * limit;
  const orderBy = getOrderBy({ schema, order, column: orderByColumn });

  return db.spn
    .select({ id: schema.id })
    .from(schema)
    .where(and(...filters))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)
    .as('subquery');
};

const getCount = async (schema: PgTable & { id: PgColumn }, filters: SQL[] = []) => {
  return await db.spn
    .select({ count: count() })
    .from(schema)
    .where(and(...filters));
};

export const getRefundLogs = async ({ limit, page }: PaginateProps) => {
  const data = getPagination({});

  const query = db.spn
    .select({
      id: refundLogs.id,
      processFortnight: refundLogs.processFortnight,
      user: user.name,
      createdAt: refundLogs.createdAt,
      rfcCreated: refundLogs.rfcCreated,
      rfcDeletedResponsabilities: refundLogs.rfcDeletedResponsabilities,
      rfcDeletedEmployeeConcept: refundLogs.rfcDeletedEmployeeConcept,
      rfcClosedTerm: refundLogs.rfcClosedTerm,
      rfcSuccesed: refundLogs.rfcSuccesed,
      rfcFailed: refundLogs.rfcFailed,
      hasError: refundLogs.hasError,
      activeBefore: refundLogs.activeBefore,
      activeAfter: refundLogs.activeAfter,
    })
    .from(refundLogs)
    .innerJoin(data, eq(refundLogs.id, data.id))
    .leftJoin(user, eq(refundLogs.userId, user.id))
    .orderBy(user.id);

  return await query;

  // return await withPagination({
  //   qb: query.$dynamic(),
  //   orderByColumn: asc(refundLogs.createdAt),
  //   page,
  //   limit,
  // });
};
