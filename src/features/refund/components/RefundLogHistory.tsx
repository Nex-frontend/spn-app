import { MantineReactTable } from 'mantine-react-table';
import { Group } from '@mantine/core';
import { DEFAULT_REFUND_SEARCH, REFUND_LOG_COLUMNS } from '../const';
import { refundQueries } from '../query';
import { RfcRefundList } from './RfcRefundList';
import { useTable } from '~/features/core';
import { Route as RefundRoute } from '~/routes/_auth/(concepts)/refund';

export const RefundLogHistory = () => {
  const { table, search } = useTable({
    columns: REFUND_LOG_COLUMNS,
    from: RefundRoute.id,
    getData: refundQueries.logs,
    initialState: DEFAULT_REFUND_SEARCH,
    globalFilterPlaceHolder: 'Buscar por RFC',
    renderDetailPanel: ({ row }) => {
      return (
        <Group align="flex-start">
          <RfcRefundList gFilter={search.gFilter} rfcList={row.original.rfcSuccess} />
          <RfcRefundList gFilter={search.gFilter} rfcList={row.original.rfcFailer} type="error" />
        </Group>
      );
    },
  });

  return (
    <>
      <MantineReactTable table={table} />
      {/* <p>Holi</p> */}
    </>
  );
};
