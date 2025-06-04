import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { RefundsLogs } from '../interfaces';
import { Column } from '~/features/core/hooks/useTable';
import { AppBadge, IconSuccess, IconWarning } from '~/features/ui';
import { DEFAULT_SEARCH_VALUES } from '~/shared';

export const DEFAULT_COLUMN = 'processFortnight';

export const DEFAULT_REFUND_SEARCH = {
  ...DEFAULT_SEARCH_VALUES,
  orderBy: DEFAULT_COLUMN,
};

export const REFUND_LOG_COLUMNS: Column<RefundsLogs>[] = [
  {
    accessorKey: 'consecutive',
    header: 'Consecutivo',
    type: 'number',
  },
  {
    accessorKey: 'processFortnight',
    header: 'Quincena Proceso',
    type: 'number',
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Fecha de creación',
    type: 'date',
  },
  {
    accessorFn: (row: RefundsLogs) => row?.user?.name ?? 'no user',
    id: 'user.name',
    header: 'Usuario',
  },

  {
    accessorKey: 'rfcCreated',
    header: 'RFC Creados',
    type: 'number',
  },
  {
    accessorKey: 'rfcDeletedResponsabilities',
    header: 'RFC Eliminados Responsabilidades',
    type: 'number',
  },
  {
    accessorKey: 'rfcDeletedEmployeeConcept',
    header: 'RFC Eliminados Empleados Concepto',
    type: 'number',
  },
  {
    accessorKey: 'rfcClosedTerm',
    header: 'RFC Cierre Vigencia',
    type: 'number',
  },
  {
    accessorKey: 'rfcSuccesed',
    header: 'RFC Exitosos',
    type: 'number',
  },
  {
    accessorKey: 'rfcFailed',
    header: 'RFC errores',
    type: 'number',
  },
  {
    accessorKey: 'hasError',
    id: 'hasError',
    header: 'Error Status',
    Cell: ({ cell }) => {
      const value = cell.getValue() === 'true' ? 'Error' : 'Sin error';
      const type = cell.getValue() === 'true' ? 'error' : 'success';

      return (
        <AppBadge type={type} size="md">
          {value}
        </AppBadge>
      );
    },
    type: 'boolean',
  },
  {
    accessorKey: 'activeBefore',
    header: 'Activos Antes',
    type: 'number',
  },
  {
    accessorKey: 'activeAfter',
    header: 'Activos Ahora',
    type: 'number',
  },
  {
    accessorKey: 'notes',
    header: 'Notas',
  },
];
