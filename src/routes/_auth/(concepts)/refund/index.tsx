import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/(concepts)/refund/')({
  component: RouteComponent,
  beforeLoad: () => ({ crumb: 'Reintegros', iconName: 'concept' }),
  head: () => ({
    meta: [
      {
        title: 'Reintegros | SPN',
      },
    ],
  }),
});

function RouteComponent() {
  return <div>Estas en Reintegros bitches</div>;
}
