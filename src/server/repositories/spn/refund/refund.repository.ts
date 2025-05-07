import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { refundLogs, user } from '~/server/db/spn/schema';

interface PaginateProps {
  total: number;
}

export const getRefundLogs = async ({ total }: PaginateProps) => {
  return await db.spn
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
    .leftJoin(user, eq(refundLogs.userId, user.id))
    .limit(total);
};
