import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Group, Menu } from '@mantine/core';
import { modals } from '@mantine/modals';
import { REFUND_LOG_COLUMNS } from '../const';
import { refundQueries } from '../query';
import { RefundUpdateNotesForm, RefundUpdateNotesFormProps } from './RefundUpdateNotesForm';
import RefundWrapperRfcList from './RefundWrapperRfcList';
import { useTable } from '~/features/core';
import { IconEdit } from '~/features/ui';
import { Route as RefundRoute } from '~/routes/_auth/(concepts)/refund';
import { DEFAULT_REFUND_SEARCH } from '~/shared';

import { ClientOnly } from '@tanstack/react-router';

type OpenNodeModalProps = Omit<RefundUpdateNotesFormProps, 'onCancel'>;

export const RefundLogHistoryTable = () => {
  const openModal = (props: OpenNodeModalProps) =>
    modals.open({
      title: 'Agregar notas de reintegros (19)',
      children: <RefundUpdateNotesForm {...props} onCancel={modals.closeAll} />,
    });

  const { table, search } = useTable({
    columns: REFUND_LOG_COLUMNS,
    from: RefundRoute.id,
    fullPath: RefundRoute.fullPath,
    getData: refundQueries.logs,
    initialState: DEFAULT_REFUND_SEARCH,
    globalFilterPlaceHolder: 'Buscar por RFC',
    renderDetailPanel: ({ row }) => {
      return (
        <Group align="flex-start">
          <RefundWrapperRfcList
            gFilter={search.gFilter}
            rfcListError={row.original.rfcErrors}
            rfcListSuccess={row.original.rfcSuccess}
          />
        </Group>
      );
    },
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item onClick={() => openModal(row.original)} leftSection={<IconEdit />}>
          Editar notas
        </Menu.Item>
      </>
    ),
  });


  return (
    <ClientOnly fallback={null}>
      <MantineReactTable table={table} />
    </ClientOnly>
  );
};
