import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { Button, Group, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  RefundAlerts,
  RefundLogHistoryTable,
  refundQueries,
  useRefundAlerts,
} from '~/features/refund';
import { IconUpload } from '~/features/ui';
import { DEFAULT_REFUND_SEARCH, RefundSearchSchema } from '~/shared';

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  component: RouteComponent,
  validateSearch: RefundSearchSchema,
  beforeLoad: async ({ context, search }) => {
    context.queryClient.prefetchQuery(refundQueries.logs({ ...search }));
    context.queryClient.prefetchQuery(refundQueries.lastConsecutive);
    return { crumb: 'Reintegros', iconName: 'concept' };
  },
  search: {
    middlewares: [stripSearchParams(DEFAULT_REFUND_SEARCH)],
  },
  head: () => ({
    meta: [{ title: 'Reintegros | SPN' }],
  }),
});

function RouteComponent() {
  const [loading, { toggle }] = useDisclosure();
  const { isFetching, hasError, hasInfo, data } = useRefundAlerts();
  const isDisabled = isFetching || hasError || hasInfo;
  const text =
    !data || isFetching
      ? 'Sin datos'
      : `Quincena Activa: ${data?.siconFortnight.fortnight} - Ultimo consecutivo: ${data?.siconFortnight.consecutive}`;

  return (
    <>
      <RefundAlerts />
      <Group justify="space-between" align="center" mt="md" mb="md">
        <Title order={4}>Historial</Title>
        <Text>{text}</Text>
        <Button
          loading={loading}
          onClick={toggle}
          disabled={isDisabled}
          leftSection={<IconUpload size={14} />}
        >
          Cargar consecutivo
        </Button>
      </Group>
      <RefundLogHistoryTable />
    </>
  );
}
