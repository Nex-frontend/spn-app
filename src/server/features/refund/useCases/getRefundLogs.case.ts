import { repository } from '~/server/repositories';

export const getLogs = async (limit: number, page: number) => {
  return await repository.spn.refunds.getRefundLogs({ limit, page });
};
