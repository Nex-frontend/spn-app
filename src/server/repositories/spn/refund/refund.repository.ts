import { desc, eq, getTableColumns, InferInsertModel } from 'drizzle-orm';
import { core } from '~/server/core';
import { db } from '~/server/db';
import { refundLogs, refundRfcFailed, refundRfcSuccess, user } from '~/server/db/spn/schema';
import { RefundUpdateNotesSchemaI, SearchSchemaI } from '~/shared';

const getSubqueryRfcSuccess = () => {
  const subqueryRfcSuccess = db.spn
    .select({
      rfc: refundRfcSuccess.rfc,
      type: refundRfcSuccess.type,
      paymentCode: refundRfcSuccess.paymentCode,
    })
    .from(refundRfcSuccess)
    .where(eq(refundRfcSuccess.refundLogsId, refundLogs.id))
    .$dynamic();

  return core.query.getRelationalColumn({
    subquery: subqueryRfcSuccess,
    as: 'rfcSuccess',
  });
};

const getSubqueryRfcFailed = () => {
  const subqueryRfcFailed = db.spn
    .select({
      rfc: refundRfcFailed.rfc,
      type: refundRfcFailed.type,
      error: refundRfcFailed.error,
      paymentCode: refundRfcFailed.paymentCode,
    })
    .from(refundRfcFailed)
    .where(eq(refundRfcFailed.refundLogsId, refundLogs.id))
    .$dynamic();

  return core.query.getRelationalColumn({
    subquery: subqueryRfcFailed,
    as: 'rfcErrors',
  });
};

export const getLogs = async (props: SearchSchemaI) => {
  const { userId, ...columns } = getTableColumns(refundLogs);

  const rfcSuccess = getSubqueryRfcSuccess();
  const rfcErrors = getSubqueryRfcFailed();

  const query = db.spn
    .select({
      ...columns,
      user: {
        id: user.id,
        name: user.name,
      },
      rfcSuccess,
      rfcErrors,
    })
    .from(refundLogs)
    .leftJoin(user, eq(userId, user.id))
    .leftJoin(refundRfcSuccess, eq(refundLogs.id, refundRfcSuccess.refundLogsId))
    .leftJoin(refundRfcFailed, eq(refundLogs.id, refundRfcFailed.refundLogsId))
    .$dynamic();

  return await core.pagination.withPagination(query, {
    ...props,
    schema: refundLogs,
    joinSchemas: {
      user: { schema: user, fieldJoin: user.id, fieldFrom: userId, type: 'leftJoin' },
      rfcSuccess: {
        schema: refundRfcSuccess,
        fieldJoin: refundRfcSuccess.refundLogsId,
        fieldFrom: refundLogs.id,
        type: 'leftJoin',
      },
      rfcFailed: {
        schema: refundRfcFailed,
        fieldJoin: refundRfcFailed.refundLogsId,
        fieldFrom: refundLogs.id,
        type: 'leftJoin',
      },
    },
  });
};

export const getLastConsecutive = async () => {
  return await db.spn
    .select({
      id: refundLogs.id,
      consecutive: refundLogs.consecutive,
      fortnight: refundLogs.processFortnight,
    })
    .from(refundLogs)
    .orderBy(desc(refundLogs.processFortnight), desc(refundLogs.consecutive))
    .limit(1);
};

export const updateNotes = async ({ id, notes }: RefundUpdateNotesSchemaI) => {
  return await db.spn.update(refundLogs).set({ notes }).where(eq(refundLogs.id, id));
};

export type RefundLogsCreate = InferInsertModel<typeof refundLogs>;

export const createOne = async (data: RefundLogsCreate) => {
  return await db.spn.insert(refundLogs).values(data).returning({ createdId: refundLogs.id });
};
