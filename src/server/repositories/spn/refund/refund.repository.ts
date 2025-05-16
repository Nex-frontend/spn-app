import { eq, getTableColumns } from 'drizzle-orm';
import { withPagination } from '~/server/core';
import { db } from '~/server/db';
import { refundLogs, user } from '~/server/db/spn/schema';
import { PaginateProps } from '~/shared';

export const getRefundLogs = async (props: PaginateProps) => {
  const { userId, ...columns } = getTableColumns(refundLogs);

  const query = db.spn
    .select({
      ...columns,
      user: {
        id: user.id,
        name: user.name,
      },
    })
    .from(refundLogs)
    .leftJoin(user, eq(userId, user.id))
    .$dynamic();

  return await withPagination(query, {
    ...props,
    schema: refundLogs,
    joinSchemas: {
      user: { schema: user, fieldJoin: user.id, fieldFrom: userId, type: 'leftJoin' },
    },
  });
};
