import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';
import { Button, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RefundLogHistory, refundQueries } from '~/features/refund';
import { Alert } from '~/features/ui';

export const refundSearchSchema = v.object({
  total: v.optional(v.fallback(v.number(), 10), 10),
});

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  component: RouteComponent,
  validateSearch: refundSearchSchema,
  beforeLoad: ({ context, search }) => {
    const { total } = search;
    context.queryClient.prefetchQuery(refundQueries.logs({ total }));
    return { crumb: 'Reintegros', iconName: 'concept' };
  },
  head: () => ({
    meta: [{ title: 'Reintegros | SPN' }],
  }),
});

function RouteComponent() {
  const [loading, { toggle }] = useDisclosure();

  // const { data: refundLogs } = useSuspenseQuery(refundQueries.logs({ total: 5 }));

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
