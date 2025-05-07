import { repository } from '~/server/repositories';

export const getLogs = async (total: number) => {
  return await repository.spn.refunds.getRefundLogs({ total });
};
