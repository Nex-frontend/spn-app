import { queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';

export const refundKeys = {
  all: ['refund'] as const,
};

export const refundQueries = {
  logs: () =>
    queryOptions({
      queryKey: refundKeys.all,
      queryFn: serverFn.refund.getRefundLogs,
    }),
};
