import { MRT_RowData } from 'mantine-react-table';
import { DataPagination } from '~/features/core/hooks/useTable/useTable.interface';
import { ErrorApp } from '~/server/core/errors';
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
      let errorMessage = 'Ocurrió un error al momento de traer los datos';
      let errorCode = 500;

      if (error instanceof ErrorApp) {
        errorMessage = error.message;
        errorCode = error.status || 400;
      }

      if (error instanceof AggregateError) {
        errorMessage = 'Error en la conexion a la base de datos';
        errorCode = 500;
      }

      return {
        data: [],
        meta: { totalRowCount: 0 },
        error: {
          message: errorMessage,
          code: errorCode,
        },
      };
    }
  };
};
