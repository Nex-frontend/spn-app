import { eq, getTableColumns, sql } from 'drizzle-orm';
import { withPagination } from '~/server/core';
import { db } from '~/server/db';
import { refundLogs, refundRfcFailed, refundRfcSuccess, user } from '~/server/db/spn/schema';
import { PaginateProps } from '~/shared';

export const getRefundLogs = async (props: PaginateProps) => {
  const { userId, ...columns } = getTableColumns(refundLogs);

  const subqueryRfcSuccess = db.spn
    .select({
      rfc: refundRfcSuccess.rfc,
      type: refundRfcSuccess.type,
    })
    .from(refundRfcSuccess)
    .where(eq(refundRfcSuccess.refundLogsId, refundLogs.id));

  const subqueryRfcFailed = db.spn
    .select({
      rfc: refundRfcFailed.rfc,
      type: refundRfcFailed.type,
      error: refundRfcFailed.error,
    })
    .from(refundRfcFailed)
    .where(eq(refundRfcFailed.refundLogsId, refundLogs.id));

  const query = db.spn
    .select({
      ...columns,
      user: {
        id: user.id,
        name: user.name,
      },
      rfcSuccess: sql`(
        SELECT json_agg(row_to_json(subquery))
        FROM (${subqueryRfcSuccess}) AS subquery
      )`.as('rfcSuccess'),
      rfcFailer: sql`(
        SELECT json_agg(row_to_json(subquery))
        FROM (${subqueryRfcFailed}) AS subquery
      )`.as('rfcFailer'),
      // rfcSuccess: {
      //   rfc: refundRfcSuccess.rfc,
      //   type: refundRfcSuccess.type,
      // },
      // rfcSuccess: sql`(
      //   SELECT json_agg(row_to_json(refundRfcSuccess))
      //   FROM ${refundRfcSuccess} AS refundRfcSuccess
      //   WHERE refundRfcSuccess."refund_logs_id" = ${refundLogs.id}
      // )`.as('rfcSuccess'),
      // rfcError: db.spn
      //   .select({ rfc: refundRfcFailed.rfc })
      //   .from(refundRfcFailed)
      //   .where(eq(refundLogs.id, refundRfcFailed.refundLogsId))
      //   .orderBy(desc(refundRfcFailed.rfc))
      //   .as('rfcError'),
      // rfcFailed: {
      //   rfc: refundRfcFailed.rfc,
      //   type: refundRfcFailed.type,
      //   error: refundRfcFailed.error,
      // },
    })
    .from(refundLogs)
    .leftJoin(user, eq(userId, user.id))
    .leftJoin(refundRfcSuccess, eq(refundLogs.id, refundRfcSuccess.refundLogsId))
    .leftJoin(refundRfcFailed, eq(refundLogs.id, refundRfcFailed.refundLogsId))
    .$dynamic();

  // const result = await db.spn
  //   .select()
  //   .from(refundLogs)
  //   .leftJoin(refundRfcSuccess, eq(refundLogs.id, refundRfcSuccess.refundLogsId));

  // console.log({ result });

  return await withPagination(query, {
    ...props,
    schema: refundLogs,
    joinSchemas: {
      user: { schema: user, fieldJoin: user.id, fieldFrom: userId, type: 'leftJoin' },
      rfcSuccess: { schema: user, fieldJoin: user.id, fieldFrom: userId, type: 'leftJoin' },
      rfcFailed: { schema: user, fieldJoin: user.id, fieldFrom: userId, type: 'leftJoin' },
    },
  });
};
