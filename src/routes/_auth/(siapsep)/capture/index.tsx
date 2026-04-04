import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/(siapsep)/capture/')({
  component: RouteComponent,
  beforeLoad: async () => ({ crumb: 'Captura SIAPSEP', iconName: 'chart' }),
  head: () => ({
    meta: [{ title: 'Captura SIAPSEP | SPN' }],
  }),
})

function RouteComponent() {
  return <div>Hello "/_auth/(siapsep)/capture/"!</div>
}
