import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import * as v from 'valibot';
import { Button, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RefundLogHistory, refundQueries } from '~/features/refund';
import { Alert } from '~/features/ui';

export const refundSearchSchema = v.object({
  limit: v.optional(v.fallback(v.number(), 10), 10),
  page: v.optional(v.fallback(v.number(), 0), 0),
});

const defaultValues = {
  limit: 10,
  page: 0,
};

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  component: RouteComponent,
  validateSearch: refundSearchSchema,
  beforeLoad: ({ context, search }) => {
    const { limit, page } = search;
    console.log({ limit, page });
    context.queryClient.prefetchQuery(refundQueries.logs({ limit, page }));
    return { crumb: 'Reintegros', iconName: 'concept' };
  },
  search: {
    middlewares: [stripSearchParams(defaultValues)],
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
