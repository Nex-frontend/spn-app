import { createServerFn } from '@tanstack/react-start';
import { refund } from '../index';
import { errorMiddleware, siapsepMiddleware, siconMiddleware } from '~/lib/middleware';
import { RefundSearchSchema, RefundUpdateNotesSchema, withPaginationHandlerError } from '~/shared';

export const getLogs = createServerFn()
  .validator(RefundSearchSchema)
  .handler(
    withPaginationHandlerError(async ({ data }) => {
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
      return await refund.cases.getLogs({ ...data });
    })
  );

export const updateNotes = createServerFn()
  .middleware([errorMiddleware])
  .validator(RefundUpdateNotesSchema)
  .handler(async ({ data }) => {
    await refund.cases.updateNotes(data);
    return { message: 'Nota actualizada' };
  });

export const getLastConsecutive = createServerFn().handler(async () => {
  return await refund.cases.getLastConsecutive();
});
