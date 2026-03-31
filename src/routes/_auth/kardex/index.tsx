import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { RfcForm, KardexList } from '~/features/kardex'

export const Route = createFileRoute('/_auth/kardex/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formValues, setFormValues] = React.useState({ rfc: '', qna_fin: '' })

  return (
    <div>
      <RfcForm formValues={formValues} setFormValues={setFormValues} />
      <KardexList formValues={formValues} />
    </div>
  )
}
