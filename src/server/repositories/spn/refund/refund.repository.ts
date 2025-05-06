import { db } from '~/server/db';
import { refundLogs } from '~/server/db/spn/schema';

export const getRefundLogs = async () => {
  return await db.spn
    .select({
      id: refundLogs.id,
      processFortnight: refundLogs.processFortnight,
      userId: refundLogs.userId,
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
    .from(refundLogs);
};
