import { MRT_ColumnDef } from 'mantine-react-table';
import { RefundsLogs } from '../interfaces';
import { DEFAULT_SEARCH_VALUES } from '~/shared';

export const DEFAULT_COLUMN = 'processFortnight';

export const DEFAULT_REFUND_SEARCH = {
  ...DEFAULT_SEARCH_VALUES,
  orderBy: DEFAULT_COLUMN,
};

export const REFUND_LOG_COLUMNS: MRT_ColumnDef<RefundsLogs>[] = [
  {
    accessorKey: 'processFortnight',
    header: 'Quincena Proceso',
    columnFilterModeOptions: ['contains', 'greaterThan', 'between'],
  },
  {
    accessorFn: (row: RefundsLogs) => row?.user?.name ?? 'no user',
    id: 'user.name',
    header: 'Usuario',
  },
  {
    accessorKey: 'rfcCreated',
    header: 'RFC Creados',
  },
  {
    accessorKey: 'rfcDeletedResponsabilities',
    header: 'RFC Eliminados Responsabilidades',
  },
  {
    accessorKey: 'rfcDeletedEmployeeConcept',
    header: 'RFC Eliminados Empleados Concepto',
  },
  {
    accessorKey: 'rfcClosedTerm',
    header: 'RFC Cierre Vigencia',
  },
  {
    accessorKey: 'rfcSuccesed',
    header: 'RFC Exitosos',
  },
  {
    accessorKey: 'rfcFailed',
    header: 'RFC errores',
  },
  {
    accessorKey: 'hasError',
    header: 'Error',
  },
  {
    accessorKey: 'activeBefore',
    header: 'Activos Antes',
  },
  {
    accessorKey: 'activeAfter',
    header: 'Activos Ahora',
    // enableColumnOrdering: false,
  },
];
