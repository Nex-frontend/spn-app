import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';
import { PaginateProps } from '~/shared';

export const refundKeys = {
  all: ['refund'] as const,
  lists: () => [...refundKeys.all, 'list'] as const,
  list: (props: PaginateProps) => [...refundKeys.lists(), { ...props }] as const,
};

export const refundQueries = {
  logs: (props: PaginateProps) =>
    queryOptions({
      queryKey: refundKeys.list(props),
      queryFn: ({ signal }) =>
        serverFn.refund.getRefundLogs({
          data: { ...props },
          signal,
        }),
      placeholderData: keepPreviousData,
    }),
};
