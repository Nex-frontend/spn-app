import { eq } from 'drizzle-orm';
import { withPagination } from '~/server/core';
import { db } from '~/server/db';
import { refundLogs, user } from '~/server/db/spn/schema';

type FilterI = {
  id: string;
  value: unknown;
}[];

type FilterFnI = {
  [x: string]: string;
};

interface PaginateProps {
  limit: number;
  page: number;
  orderBy: string;
  order: 'asc' | 'desc';
  filters: FilterI;
  filtersFn: FilterFnI;
}

export const getRefundLogs = async ({
  limit,
  page,
  orderBy,
  order,
  filters,
  filtersFn,
}: PaginateProps) => {
  console.log({ filters, filtersFn });

  const query = db.spn
    .select({
      id: refundLogs.id,
      processFortnight: refundLogs.processFortnight,
      user: {
        id: user.id,
        name: user.name,
      },
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
    .leftJoin(user, eq(refundLogs.userId, user.id))
    .$dynamic();

  // console.log(Object.keys(query._.selectedFields));

  // globalFields = ['user.name', 'processFortnight',  .....]
  // globalFilter = { value: 'eduardo',  globalFields: ['user.name', 'processFortnight', ...] }

  return await withPagination(query, {
    page,
    limit,
    schema: refundLogs,
    order,
    orderColumn: orderBy,
    joinSchemas: { user },
    filters,
    filtersFn,
  });
};
