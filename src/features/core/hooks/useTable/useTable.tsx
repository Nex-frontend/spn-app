import { useMemo, useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ColumnFiltersState, PaginationState, SortingState, Updater } from '@tanstack/table-core';
import { MRT_FilterOption, MRT_RowData, useMantineReactTable } from 'mantine-react-table';
import { MRT_Localization_ES } from 'mantine-react-table/locales/es/index.cjs';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { UseTableProps } from './useTable.interface';
import { isEmpty, isFunction } from '~/shared';

const COLUMNS_STRING_FILTER: Array<MRT_FilterOption | string> = [
  'startsWith',
  'endsWith',
  'contains',
  'equals',
  'notEquals',
];
const COLUMNS_NUMBER_FILTER: Array<MRT_FilterOption | string> = [
  'between',
  'equals',
  'notEquals',
  'greaterThan',
  'greaterThanOrEqualTo',
  'lessThan',
  'lessThanOrEqualTo',
];
const COLUMNS_BOOLEAN_FILTER: Array<MRT_FilterOption | string> = ['equals'];

const COLUMNS_REF = {
  string: COLUMNS_STRING_FILTER,
  boolean: COLUMNS_BOOLEAN_FILTER,
  number: COLUMNS_NUMBER_FILTER,
  date: COLUMNS_NUMBER_FILTER,
};

export const getColumns = (columns: any[]) => {
  const newColumns =
    columns?.map((column) => {
      const type = column.type ?? 'string';
      const columnFilterModeOptions = COLUMNS_REF[type];
      const filterFn = type === 'string' ? 'contains' : 'equals';

      return {
        ...column,
        columnFilterModeOptions,
        filterFn,
        meta: filterFn,
      };
    }) ?? [];

  return newColumns;
};

const reCreateFilters = (filters: ColumnFiltersState) => {
  const newFilters = filters.map((filter) => {
    if (Array.isArray(filter.value) && filter.value.length === 2) {
      return { ...filter, key: `${filter.value[0]} - ${filter.value[1]}` };
    }
    return { ...filter, key: '' };
  });

  return newFilters;
};

export const useTable = <T extends MRT_RowData, F extends string>({
  columns,
  from,
  initialState,
  getData,
  fullPath,
}: UseTableProps<T, F>) => {
  const columnsMemo = useMemo(() => getColumns(columns), []);
  // const columnsMemo = useMemo(() => columns, []);

  const search = useSearch({ from });
  // const [fil, setFil] = useState();
  const navigate = useNavigate();

  const columnsFilter = Object.fromEntries(
    columnsMemo.map(({ accessorKey, meta, id }) => [
      accessorKey ?? id,
      typeof meta === 'string' ? meta : 'contains',
    ])
  );
  const { data, isLoading, isFetching, isError, refetch } = useQuery(getData({ ...search }));

  const navigateSearch = (searchParams: Partial<typeof search>) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        ...searchParams,
      }),
      replace: true,
      resetScroll: false,
      // reloadDocument: true,
    });
  };

  const handlePaginationChange = (pagination: Updater<PaginationState>) => {
    const newPagination = isFunction(pagination)
      ? pagination({
          pageIndex: search.page,
          pageSize: search.limit,
        })
      : pagination;

    navigateSearch({ page: newPagination.pageIndex, limit: newPagination.pageSize });
  };

  const handleFilterChange = (filters: Updater<ColumnFiltersState>) => {
    // console.log('changed');
    const newFilters = isFunction(filters)
      ? filters(search.filters ? [...search.filters] : [])
      : filters;

    // setFil(newFilters);

    const refreshFilters = reCreateFilters(newFilters);
    navigateSearch({ filters: [...refreshFilters] });
  };

  const handlerFilterFnChange = (filterFns: Updater<{ [key: string]: MRT_FilterOption }>) => {
    const newFilterFns = isFunction(filterFns)
      ? filterFns(isEmpty(search.filtersFn) ? columnsFilter : search.filtersFn)
      : filterFns;

    navigateSearch({ filtersFn: newFilterFns });
  };

  const handleSortChange = (sort: Updater<SortingState>) => {
    const [{ id, desc }] = isFunction(sort) ? sort([{ id: 'id', desc: true }]) : sort;
    navigateSearch({ orderBy: id, order: desc ? 'desc' : 'asc' });
  };

  const fetchedRefunds = data?.data ?? [];
  const totalRowCount = data?.meta.totalRowCount ?? 0;

  const handleReset = () => {
    table.reset();
    navigateSearch({ ...initialState });
  };

  const table = useMantineReactTable({
    columns: columnsMemo,
    data: fetchedRefunds,
    renderTopToolbarCustomActions: () => (
      <>
        <Tooltip label="Refresh Data">
          <ActionIcon onClick={() => refetch()}>
            <IconRefresh />
          </ActionIcon>
        </Tooltip>
        <Button onClick={handleReset}>Reset baby</Button>
      </>
    ),
    enableColumnOrdering: true,
    enableColumnPinning: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableGlobalFilter: false,
    initialState: { showColumnFilters: true },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortChange,
    onColumnFilterFnsChange: handlerFilterFnChange,
    onColumnFiltersChange: handleFilterChange,
    // onColumnFiltersChange: setFil,
    localization: MRT_Localization_ES,
    rowCount: totalRowCount,
    enableColumnFilterModes: true,
    enableColumnResizing: true,
    state: {
      columnFilterFns: isEmpty(search.filtersFn) ? columnsFilter : search.filtersFn,
      // columnFilterFns: search.filtersFn ?? columnsFilter,
      // columnFilterFns: { ...columnsFilter, ...search.filtersFn },
      columnFilters: search.filters ?? [],
      isLoading,
      pagination: {
        pageIndex: search.page,
        pageSize: search.limit,
      },
      sorting: [{ id: search.orderBy, desc: search.order === 'desc' }],
      showAlertBanner: isError,
      showProgressBars: isFetching,
    },
  });

  return {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    table,
  };
};
