import { createServerFn } from '@tanstack/react-start';
import { refund } from '../index';
import { PaginateProps, withPaginationHandlerError } from '~/shared';

export const getRefundLogs = createServerFn()
  .validator((data: PaginateProps) => data)
  .handler(
    withPaginationHandlerError(async (ctx) => {
      const { data } = ctx;

      if (data.gFilter) {
        const rfcSuccess = [
          {
            id: 'rfcSuccess.rfc',
            value: data.gFilter,
            key: '',
          },
        ];

        const rfcError = [
          {
            id: 'rfcFailed.rfc',
            value: data.gFilter,
            key: '',
          },
        ];

        data.filters = [...data.filters, ...rfcSuccess, ...rfcError];
      }
      return await refund.cases.getLogs({ ...ctx.data });
    })
  );
