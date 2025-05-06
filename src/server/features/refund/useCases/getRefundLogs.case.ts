import { repository } from '~/server/repositories';

export const getRefundLogs = async () => {
  return await repository.spn.refunds.getRefundLogs();
};
