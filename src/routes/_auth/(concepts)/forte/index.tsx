import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/(concepts)/forte/')({
  component: RouteComponent,
  beforeLoad: () => ({ crumb: 'Forte', iconName: 'concept' }),
  head: () => ({
    meta: [
      {
        title: 'Forte | SPN',
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div>
      {' '}
      <Outlet />
    </div>
  );
}
