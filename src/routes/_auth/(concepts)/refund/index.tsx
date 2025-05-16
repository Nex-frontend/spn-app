import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { Button, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  DEFAULT_REFUND_SEARCH,
  RefundLogHistory,
  refundQueries,
  RefundSearchSchema,
} from '~/features/refund';
import { Alert } from '~/features/ui';

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  component: RouteComponent,
  validateSearch: RefundSearchSchema,
  beforeLoad: ({ context, search }) => {
    context.queryClient.prefetchQuery(refundQueries.logs({ ...search }));
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

  return (
    <>
      <Alert type="warning" title="Desfase de captura" isDissmisible>
        Se detectó un desfase en el consecutivo de reintegros de SICON, que NO se se ha procesado en
        el SIAPSEP. Favor de verificarlo.
      </Alert>

      <Group justify="space-between" align="center" mt="md">
        <Title order={4}>Historial</Title>
        <Button loading={loading} onClick={toggle}>
          Verificar consecutivo
        </Button>
      </Group>
      <RefundLogHistory />
    </>
  );
}
