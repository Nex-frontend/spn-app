import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { kardexQueries } from '../query'
import { KardexSearchByRFCI } from '~/shared'

interface KardexListProps {
  formValues: KardexSearchByRFCI
}

export const KardexList = ({ formValues }: KardexListProps) => {
  const { data, isLoading, isError, error } = useQuery(
    kardexQueries.rfcSearch(formValues)
  )

  if (!formValues.rfc.trim()) {
    return <p>Ingresa un RFC (parcial) y opcionalmente Qna Fin, luego presiona Buscar para ver resultados.</p>
  }

  if (isLoading) {
    return <p>Cargando datos del kardex...</p>
  }

  if (isError) {
    return <p>Error al cargar: {(error as Error)?.message ?? 'Desconocido'}</p>
  }

  if (!data || data.length === 0) {
    return <p>No se encontraron registros para el RFC: {formValues.rfc}{formValues.qna_fin ? ` y Qna Fin: ${formValues.qna_fin}` : ''}</p>
  }

  return (
    <div style={{ overflowX: 'auto', marginTop: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>RFC</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Código pago</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Unidad</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Subunidad</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Qna ini</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Qna fin</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`${item.rfc}-${item.cod_pago}-${item.qna_ini}-${item.qna_fin}`}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.rfc}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.cod_pago}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.unidad}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.subunidad}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.qna_ini}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.qna_fin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
