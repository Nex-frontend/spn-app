import { repository } from '~/server/repositories';
import { PaginateProps } from '~/shared';

export const getLogs = async (props: PaginateProps) => {
  return await repository.spn.refunds.getRefundLogs({ ...props });
};
