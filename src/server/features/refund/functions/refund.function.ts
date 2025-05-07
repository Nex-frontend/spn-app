import { createServerFn } from '@tanstack/react-start';
import { refund } from '../index';

export const getRefundLogs = createServerFn()
  .validator((data: { total: number }) => data)
  .handler(async (ctx) => {
    return await refund.cases.getLogs(ctx.data.total);
  });
