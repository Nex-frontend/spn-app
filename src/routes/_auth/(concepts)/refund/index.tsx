import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { Group, Text, Title } from '@mantine/core';
import {
  RefundAlerts,
  RefundGenerateConsecutiveBtn,
  RefundLogHistoryTable,
  refundQueries,
  useRefundAlerts,
} from '~/features/refund';
import { DEFAULT_REFUND_SEARCH, RefundSearchSchema } from '~/shared';

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  ssr: 'data-only',
  component: RouteComponent,
  validateSearch: RefundSearchSchema,
  beforeLoad: async ({ context, search }) => {
    context.queryClient.prefetchQuery(refundQueries.logs({ ...search }));
    context.queryClient.prefetchQuery(refundQueries.lastConsecutive());
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
  const { data, isFetching } = useRefundAlerts();
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
        <RefundGenerateConsecutiveBtn />
      </Group>
      <RefundLogHistoryTable />
    </>
  );
}
