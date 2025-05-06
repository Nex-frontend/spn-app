import { createServerFn } from '@tanstack/react-start';
import { refund } from '../index';

export const getRefundLogs = createServerFn().handler(async () => {
  return await refund.cases.getRefundLogs();
});
