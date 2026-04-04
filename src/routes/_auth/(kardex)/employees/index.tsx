import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/(kardex)/employees/')({
  component: RouteComponent,
  beforeLoad: async () => ({ crumb: 'Kardex de empleados', iconName: 'employees' }),
  head: () => ({
    meta: [{ title: 'Kardex de empleados | SPN' }],
  }),
})

function RouteComponent() {
  return <div>Hello "/_auth/(kardex)/empleados/"!</div>
}
