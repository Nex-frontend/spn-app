import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import * as v from 'valibot';
import { Button, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RefundLogHistory, refundQueries } from '~/features/refund';
import { Alert } from '~/features/ui';

// import { getRefundLogs } from '~/server/features/refund/functions';

const Order = ['desc', 'asc'] as const;
const FilterSchema = v.array(
  v.object({
    id: v.string(),
    value: v.unknown(),
  })
);
type FilterI = v.InferInput<typeof FilterSchema>;

// type ArrayElement<T> = T extends (infer U)[] ? U : never;
// type Refunds = ArrayElement<Awaited<ReturnType<typeof getRefundLogs>>['data']>;
// type RefundsKeys = keyof Refunds;

const FilterFnSchema = v.record(v.string(), v.string());
type FilterFnI = v.InferInput<typeof FilterFnSchema>;

export const refundSearchSchema = v.object({
  limit: v.optional(v.fallback(v.number(), 10), 10),
  page: v.optional(v.fallback(v.number(), 0), 0),
  orderBy: v.optional(v.fallback(v.string(), 'processFortnight'), 'processFortnight'),
  order: v.optional(v.fallback(v.picklist(Order), 'desc'), 'desc'),
  filters: v.optional(v.fallback(FilterSchema, []), []),
  filtersFn: v.optional(v.fallback(FilterFnSchema, {}), {}),
});

interface DefaultValues {
  limit: number;
  page: number;
  orderBy: string;
  order: 'asc' | 'desc';
  filters: FilterI;
  filtersFn: FilterFnI;
}

const defaultValues: DefaultValues = {
  limit: 10,
  page: 0,
  orderBy: 'processFortnight',
  order: 'desc',
  filters: [],
  filtersFn: {},
};

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  component: RouteComponent,
  validateSearch: refundSearchSchema,
  beforeLoad: ({ context, search }) => {
    const { limit, page, orderBy, order, filters, filtersFn } = search;
    context.queryClient.prefetchQuery(
      refundQueries.logs({ limit, page, orderBy, order, filters, filtersFn })
    );
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
