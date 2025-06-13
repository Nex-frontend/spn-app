import { serverFn } from '~/server/functions';
import { ReturnPaginateData } from '~/shared';

export type RefundsLogs = ReturnPaginateData<typeof serverFn.refund.getLogs>;
