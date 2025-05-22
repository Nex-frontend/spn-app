import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { MantineReactTable } from 'mantine-react-table';
import { Checkbox } from '@mantine/core';
import { DEFAULT_REFUND_SEARCH, REFUND_LOG_COLUMNS } from '../const';
import { refundQueries } from '../query';
import { Example } from './TableBasic';
import { useTable } from '~/features/core';
import { Route as RefundRoute } from '~/routes/_auth/(concepts)/refund';

export const RefundLogHistory = () => {
  const { table } = useTable({
    columns: REFUND_LOG_COLUMNS,
    from: RefundRoute.id,
    fullPath: RefundRoute.fullPath,
    getData: refundQueries.logs,
    initialState: DEFAULT_REFUND_SEARCH,
  });
  // const search = useSearch({ from: RefundRoute.id });

  // const { data, isLoading, isFetching, isError, refetch } = useQuery(
  //   refundQueries.logs({ ...search })
  // );

  // console.log({ data });
  return (
    <>
      <MantineReactTable table={table} />
      {/* <Example /> */}
    </>
  );
};
