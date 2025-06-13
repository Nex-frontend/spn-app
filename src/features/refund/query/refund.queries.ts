import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';
import { SearchSchemaI } from '~/shared';

export const refundKeys = {
  all: ['refund'] as const,
  lists: () => [...refundKeys.all, 'list'] as const,
  list: (props: SearchSchemaI) => [...refundKeys.lists(), { ...props }] as const,
  detail: (id: number) => [...refundKeys.all, id] as const,
};

export const refundQueries = {
  logs: (props: SearchSchemaI) =>
    queryOptions({
      queryKey: refundKeys.list(props),
      queryFn: ({ signal }) =>
        serverFn.refund.getLogs({
          data: { ...props },
          signal,
        }),
      placeholderData: keepPreviousData,
    }),
};
