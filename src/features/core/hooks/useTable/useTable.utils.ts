import { ColumnFiltersState } from '@tanstack/table-core';
import { MRT_ColumnDef, MRT_RowData } from 'mantine-react-table';
import { BooleanFilterTypes, NumberFilterTypes, StringFilterTypes } from '~/shared';

const COLUMNS_STRING_FILTER: Array<StringFilterTypes> = [
  'startsWith',
  'endsWith',
  'contains',
  'equals',
  'notEquals',
];
const COLUMNS_NUMBER_FILTER: Array<NumberFilterTypes> = [
  'between',
  'equals',
  'notEquals',
  'greaterThan',
  'greaterThanOrEqualTo',
  'lessThan',
  'lessThanOrEqualTo',
];
const COLUMNS_BOOLEAN_FILTER: Array<BooleanFilterTypes> = ['equals'];

const COLUMNS_REF = {
  string: COLUMNS_STRING_FILTER,
  boolean: COLUMNS_BOOLEAN_FILTER,
  number: COLUMNS_NUMBER_FILTER,
  date: COLUMNS_NUMBER_FILTER,
};

export type ColumnType = 'string' | 'number' | 'date' | 'boolean';
export type Column<T extends MRT_RowData> = MRT_ColumnDef<T> & { type?: ColumnType };

export const getColumns = <T extends MRT_RowData>(columns: Column<T>[]) => {
  const newColumns =
    columns?.map((column) => {
      const type = column.type ?? 'string';
      const columnFilterModeOptions = COLUMNS_REF[type];
      const filterFn = type === 'string' ? 'contains' : 'equals';

      const columnTyped: Column<T> = {
        ...column,
        columnFilterModeOptions,
        filterFn,
        meta: filterFn,
      };

      if (type === 'boolean') {
        columnTyped.filterVariant = 'checkbox';
        columnTyped.enableColumnFilterModes = false;
        columnTyped.accessorFn = (row: T) => {
          if (typeof columnTyped.accessorKey === 'string' && columnTyped.accessorKey in row) {
            return row[columnTyped.accessorKey] ? 'true' : 'false';
          }
          return 'false';
        };

        return columnTyped;
      }

      if (type === 'date') {
        columnTyped.filterVariant = 'date';
        columnTyped.Cell = ({ cell }) => {
          return cell.getValue<Date>()?.toISOString().replace(/[TZ]/g, ' ').slice(0, 19);
        };

        return columnTyped;
      }

      return columnTyped;
    }) ?? [];

  return newColumns;
};

export const recreateFilters = (filters: ColumnFiltersState) => {
  const newFilters = filters.map((filter) => {
    if (Array.isArray(filter.value) && filter.value.length === 2) {
      return { ...filter, key: `${filter.value[0]} - ${filter.value[1]}` };
    }
    return { ...filter, key: '' };
  });

  return newFilters;
};
