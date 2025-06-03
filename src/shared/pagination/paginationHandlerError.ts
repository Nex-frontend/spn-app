import { MRT_RowData } from 'mantine-react-table';
import { DataPagination } from '~/features/core/hooks/useTable/useTable.interface';
import { handlerError } from '~/server/core/errors';
import { PaginateProps } from '~/shared';

export const withPaginationHandlerError = <T extends MRT_RowData>(
  handler: (ctx: { data: PaginateProps }) => Promise<DataPagination<T>>
): ((ctx: any) => Promise<{
  data: T[] | [];
  meta: { totalRowCount: number };
  error?: { message: string; code: number };
}>) => {
  return async (ctx) => {
    try {
      return await handler(ctx);
    } catch (error) {
      const { message, status } = handlerError(error);

      return {
        data: [],
        meta: { totalRowCount: 0 },
        error: {
          message,
          code: status,
        },
      };
    }
  };
};
