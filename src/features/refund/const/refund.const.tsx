import { MRT_ColumnDef } from 'mantine-react-table';
import { RefundsLogs } from '../interfaces';
import { DEFAULT_SEARCH_VALUES } from '~/shared';

export const DEFAULT_COLUMN = 'processFortnight';

export const DEFAULT_REFUND_SEARCH = {
  ...DEFAULT_SEARCH_VALUES,
  orderBy: DEFAULT_COLUMN,
};

type ColumnType = 'string' | 'number' | 'date' | 'boolean';
type Column = MRT_ColumnDef<RefundsLogs> & { type?: ColumnType };

export const REFUND_LOG_COLUMNS: Column[] = [
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
    Cell: ({ cell }) => (cell.getValue() === 'true' ? 'Error' : 'Sin error'),
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
];
