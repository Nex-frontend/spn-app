import { createServerFn } from '@tanstack/react-start';
import { refund } from '../index';
import { PaginateProps } from '~/shared';

export const getRefundLogs = createServerFn()
  .validator((data: PaginateProps) => data)
  .handler(async (ctx) => {
    return await refund.cases.getLogs({ ...ctx.data });
  });
