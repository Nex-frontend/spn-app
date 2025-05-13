import { createServerFn } from '@tanstack/react-start';
import { refund } from '../index';

type FilterI = {
  id: string;
  value: unknown;
}[];

type FilterFnI = {
  [x: string]: string;
};

export const getRefundLogs = createServerFn()
  .validator(
    (data: {
      limit: number;
      page: number;
      orderBy: string;
      order: 'asc' | 'desc';
      filters: FilterI;
      filtersFn: FilterFnI;
    }) => data
  )
  .handler(async (ctx) => {
    return await refund.cases.getLogs({ ...ctx.data });
  });
