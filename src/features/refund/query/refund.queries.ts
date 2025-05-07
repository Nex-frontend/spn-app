import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';

export const refundKeys = {
  all: ['refund'] as const,
};

interface Props {
  total: number;
}

export const refundQueries = {
  logs: ({ total }: Props) =>
    queryOptions({
      queryKey: [...refundKeys.all, total],
      queryFn: ({ signal }) => serverFn.refund.getRefundLogs({ data: { total }, signal }),
      placeholderData: keepPreviousData,
    }),
};
