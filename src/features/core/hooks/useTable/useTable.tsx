import { useMemo } from 'react';
import { IconSend, IconUserCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ColumnFiltersState, PaginationState, SortingState, Updater } from '@tanstack/table-core';
import {
  MRT_FilterOption,
  MRT_RowData,
  MRT_ShowHideColumnsButton,
  MRT_TablePagination,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_ES } from 'mantine-react-table/locales/es/index.cjs';
import { ActionIcon, Flex, Group, Menu, Stack, Tooltip } from '@mantine/core';
import { UseTableProps } from './useTable.interface';
import { getColumns, recreateFilters } from './useTable.utils';
import { IconError, IconRefresh, IconSettingsOff } from '~/features/ui';
import { EmptySearch } from '~/features/ui/components/Searchbar/EmptySearch';
import { isEmpty, isFunction } from '~/shared';

export const useTable = <T extends MRT_RowData, F extends string>({
  columns,
  from,
  initialState,
  getData,
  renderDetailPanel,
  globalFilterPlaceHolder,
  renderRowActions,
  renderRowActionMenuItems,
  enableGlobalFilter = true,
}: UseTableProps<T, F>) => {
  const columnsMemo = useMemo(() => getColumns(columns), []);

  const search = useSearch({ from });
  const navigate = useNavigate();
  // Removed unused and incorrectly typed enableRowActions variable

  const columnsFilter = Object.fromEntries(
    columnsMemo.map(({ accessorKey, meta, id }) => [
      accessorKey ?? id,
      typeof meta === 'string' ? meta : 'contains',
    ])
  );

  const { data, isLoading, isFetching, refetch } = useQuery(getData({ ...search }));

  const navigateSearch = (searchParams: Partial<typeof search>) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        ...searchParams,
      }),
      replace: true,
      resetScroll: false,
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
    const newFilters = isFunction(filters)
      ? filters(search.filters ? [...search.filters] : [])
      : filters;

    const refreshFilters = recreateFilters(newFilters);
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

  const handleGlobalFilterChange = (value: string) => {
    navigateSearch({ gFilter: value });
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
    renderEmptyRowsFallback: () => (
      <div className="p-4">
        <EmptySearch />
      </div>
    ),
    enableColumnOrdering: true,
    enableColumnPinning: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableGlobalFilter,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortChange,
    onColumnFilterFnsChange: handlerFilterFnChange,
    onColumnFiltersChange: handleFilterChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    localization: MRT_Localization_ES,
    rowCount: totalRowCount,
    enableColumnFilterModes: true,
    enableColumnResizing: true,
    enableRowActions: !!(renderRowActions || renderRowActionMenuItems),
    initialState: {
      showGlobalFilter: true,
      showColumnFilters: true,
      columnPinning: {
        left: ['mrt-row-expand'],
        right: ['mrt-row-actions'],
      },
    },
    mantineSearchTextInputProps: {
      placeholder: globalFilterPlaceHolder ?? 'Buscar...',
      variant: 'default',
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acciones', //change header text
        size: 100, //make actions column wider
      },
    },
    mantineToolbarAlertBannerProps: !!data?.error?.message
      ? {
          color: 'red',
          children: data.error.message,
          icon: <IconError />,
          title: 'Error al cargar los datos',
        }
      : undefined,
    renderBottomToolbar: ({ table }) => (
      <Flex justify="flex-end">
        <MRT_TablePagination table={table} />
      </Flex>
    ),
    renderTopToolbarCustomActions: () => (
      <Flex gap="xs" align="center">
        <Tooltip label="Refrescar tabla">
          <ActionIcon onClick={() => refetch()} variant="light">
            <IconRefresh />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Reiniciar filtros y orden">
          <ActionIcon onClick={handleReset} variant="light">
            <IconSettingsOff />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <Flex gap="xs" align="center">
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Flex>
    ),
    renderRowActionMenuItems,
    renderRowActions,
    renderDetailPanel: fetchedRefunds.length === 0 ? undefined : renderDetailPanel,
    state: {
      columnFilterFns: isEmpty(search.filtersFn) ? columnsFilter : search.filtersFn,
      columnFilters: search.filters ?? [],
      globalFilter: search.gFilter,
      isLoading,
      pagination: {
        pageIndex: search.page,
        pageSize: search.limit,
      },
      sorting: [{ id: search.orderBy, desc: search.order === 'desc' }],
      showAlertBanner: !!data?.error,
      showProgressBars: isFetching,
    },
  });

  return {
    data,
    search,
    isLoading,
    isFetching,
    refetch,
    table,
  };
};
