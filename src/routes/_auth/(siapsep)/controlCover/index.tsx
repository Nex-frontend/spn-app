import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/(siapsep)/controlCover/')({
  component: RouteComponent,
  beforeLoad: async () => ({ crumb: 'Control de caratulas', iconName: 'control' }),
  head: () => ({
    meta: [{ title: 'Control de caratulas | SPN' }],
  }),
})

function RouteComponent() {
  return <div>Hello "/_auth/(siapsep)/controlCover/"!</div>
}
