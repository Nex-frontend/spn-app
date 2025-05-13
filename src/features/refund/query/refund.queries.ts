import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';

export const refundKeys = {
  all: ['refund'] as const,
};

type FilterI = {
  id: string;
  value: unknown;
}[];

type FilterFnI = {
  [x: string]: string;
};

interface Props {
  limit: number;
  page: number;
  orderBy: string;
  order: 'asc' | 'desc';
  filters: FilterI;
  filtersFn: FilterFnI;
}

export const refundQueries = {
  logs: ({ limit, page, orderBy, order, filters, filtersFn }: Props) =>
    queryOptions({
      queryKey: [...refundKeys.all, limit, page, orderBy, order, filters, filtersFn],
      queryFn: ({ signal }) =>
        serverFn.refund.getRefundLogs({
          data: { limit, page, orderBy, order, filters, filtersFn },
          signal,
        }),
      placeholderData: keepPreviousData,
    }),
};
