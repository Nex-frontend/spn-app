import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';

export const refundKeys = {
  all: ['refund'] as const,
};

interface Props {
  limit: number;
  page: number;
}

export const refundQueries = {
  logs: ({ limit, page }: Props) =>
    queryOptions({
      queryKey: [...refundKeys.all, limit, page],
      queryFn: ({ signal }) => serverFn.refund.getRefundLogs({ data: { limit, page }, signal }),
      placeholderData: keepPreviousData,
    }),
};
