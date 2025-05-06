import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { refundQueries } from '~/features/refund';
import { Alert } from '~/features/ui';

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    context.queryClient.prefetchQuery(refundQueries.logs());
    return { crumb: 'Reintegros', iconName: 'concept' };
  },
  head: () => ({
    meta: [{ title: 'Reintegros | SPN' }],
  }),
});

function RouteComponent() {
  const [loading, { toggle }] = useDisclosure();

  const { data: refundLogs } = useSuspenseQuery(refundQueries.logs());

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
      {/* <RefundLogHistory /> */}
    </>
  );
}
