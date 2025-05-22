import { MRT_ColumnDef, MRT_FilterOption } from 'mantine-react-table';
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
    // columnFilterModeOptions: ['contains', 'greaterThan', 'between'],
    // filterFn: 'contains',
  },
  {
    accessorFn: (row: RefundsLogs) => {
      //convert to Date for sorting and filtering
      // console.log({ created: row.createdAt });
      // const sDay = new Date(row.createdAt);
      // // sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
      // return sDay;
      return row.createdAt;
    },
    id: 'createdAt',
    header: 'Fecha de creación',
    filterVariant: 'date',
    type: 'date',
    // filterFn: 'date-range',
    // sortingFn: 'datetime',
    // columnFilterModeOptions: ['greaterThan', 'between', 'lessThanOrEqualTo', 'equals'],
    // filterFn: 'equals',
    // meta: 'equals',
    // enableColumnFilterModes: false, //keep this as only date-range filter with between inclusive filterFn
    Cell: ({ cell }) => {
      // console.log(cell.getValue());
      return cell.getValue<Date>()?.toISOString().slice(0, 10);
    }, //render Date as a string
    // Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
  },
  {
    accessorFn: (row: RefundsLogs) => row?.user?.name ?? 'no user',
    id: 'user.name',
    header: 'Usuario',
    filterFn: 'contains',
  },

  {
    accessorKey: 'rfcCreated',
    header: 'RFC Creados',
    // type: 'number',
  },
  {
    accessorKey: 'rfcDeletedResponsabilities',
    header: 'RFC Eliminados Responsabilidades',
    // type: 'number',
  },
  {
    accessorKey: 'rfcDeletedEmployeeConcept',
    header: 'RFC Eliminados Empleados Concepto',
    // type: 'number',
  },
  {
    accessorKey: 'rfcClosedTerm',
    header: 'RFC Cierre Vigencia',
    // type: 'number',
  },
  {
    accessorKey: 'rfcSuccesed',
    header: 'RFC Exitosos',
    // type: 'number',
  },
  {
    accessorKey: 'rfcFailed',
    header: 'RFC errores',
    // type: 'number',
  },
  {
    // accessorKey: 'hasError',
    // header: 'Error',
    // type: 'boolean',
    accessorFn: (row: RefundsLogs) => (row.hasError ? 'true' : 'false'),
    // accessorFn: (row: RefundsLogs) => row.hasError,
    accessorKey: 'hasError',
    id: 'hasError',
    header: 'Error Status',
    filterVariant: 'checkbox',
    Cell: ({ cell }) => (cell.getValue() === 'true' ? 'Error' : 'Sin error'),
    enableColumnFilterModes: false,
    type: 'boolean',
    // filterFn: 'equals',
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
