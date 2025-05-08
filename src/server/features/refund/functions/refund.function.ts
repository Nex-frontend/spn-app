import { createServerFn } from '@tanstack/react-start';
import { refund } from '../index';

export const getRefundLogs = createServerFn()
  .validator((data: { limit: number; page: number }) => data)
  .handler(async (ctx) => {
    return await refund.cases.getLogs(ctx.data.limit, ctx.data.page);
  });
