import { useMemo } from 'react';
import { table } from 'console';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { RegisteredRouter, RouteById, useNavigate, useSearch } from '@tanstack/react-router';
import { ColumnFiltersState, PaginationState, SortingState, Updater } from '@tanstack/table-core';
import {
  MRT_ColumnDef,
  MRT_FilterOption,
  MRT_RowData,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_ES } from 'mantine-react-table/locales/es/index.cjs';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { PaginateProps } from '~/shared';

// TODO: Study what happends here, k extends keyof ?? and ternary operation in interfaces
type RouteIdWithSearchKeys<K extends string> = {
  [R in keyof RegisteredRouter['routesById']]: K extends keyof RouteById<
    RegisteredRouter['routeTree'],
    R
  >['types']['searchSchema']
    ? R
    : never;
}[keyof RegisteredRouter['routesById']];

type RouteIdWithSearchPath<K extends string> = {
  [R in keyof RegisteredRouter['routesByPath']]: K extends keyof RouteById<
    RegisteredRouter['routeTree'],
    R
  >['types']['searchSchema']
    ? R
    : never;
}[keyof RegisteredRouter['routesByPath']];

// TODO: RequiredSearchKeys should be an paginateSchema valibot type
type RequiredSearchKeys = 'page' | 'limit';
type RoutesWithPageAndLimit = RouteIdWithSearchKeys<RequiredSearchKeys>;
type RoutesWithPath = RouteIdWithSearchPath<RequiredSearchKeys>;

interface Test<T extends MRT_RowData> {
  data: T[];
  meta: { totalRowCount?: number };
}

interface UseTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  from: RoutesWithPageAndLimit;
  fullPath: RoutesWithPath;
  getData: (props: PaginateProps) => UseQueryOptions<Test<T>>;
}

// type SearchParams = {
//   limit: number;
//   page: number;
//   orderBy: string;
//   order: 'asc' | 'desc';
//   filters: {
//     id: string;
//     value: unknown;
//   }[];
//   filtersFn: {
//     [x: string]: string;
//   };
// };

export const useTable = <T extends MRT_RowData>({
  columns,
  from,
  getData,
  fullPath,
}: UseTableProps<T>) => {
  const columnsMemo = useMemo(() => columns, []);
  const search = useSearch({ from });
  const navigate = useNavigate({ from: fullPath });

  const columnsFilter = Object.fromEntries(
    columnsMemo.map(({ accessorKey }) => [accessorKey, 'contains'])
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery(getData({ ...search }));

  const handlePaginationChange = (pagination: Updater<PaginationState>) => {
    const newPagination =
      typeof pagination === 'function'
        ? pagination({
            pageIndex: search.page,
            pageSize: search.limit,
          })
        : pagination;

    navigate({
      search: (prev) => ({
        ...prev,
        page: newPagination.pageIndex,
        limit: newPagination.pageSize,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const handleFilterChange = (filters: Updater<ColumnFiltersState>) => {
    const newFilters =
      typeof filters === 'function' ? filters(search.filters ? [...search.filters] : []) : filters;

    navigate({
      search: (prev) => ({
        ...prev,
        filters: [...newFilters],
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const handlerFilterFnChange = (filterFns: Updater<{ [key: string]: MRT_FilterOption }>) => {
    const newFilterFns =
      typeof filterFns === 'function'
        ? filterFns(search.filtersFn ? search.filtersFn : columnsFilter)
        : filterFns;

    // ({ [id]: newFilterFns[id] || 'contains' }))

    navigate({
      search: (prev) => ({
        ...prev,
        // filtersFn: [...filteredFns]
        filtersFn: newFilterFns,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const handleSortChange = (sort: Updater<SortingState>) => {
    const newSort =
      typeof sort === 'function'
        ? sort([
            {
              id: 'id',
              desc: true,
            },
          ])
        : sort;

    navigate({
      search: (prev) => ({
        ...prev,
        orderBy: newSort[0].id,
        order: newSort[0].desc ? 'desc' : 'asc',
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const fetchedRefunds = data?.data ?? [];
  const totalRowCount = data?.meta.totalRowCount ?? 0;

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
        <Button onClick={() => table.reset()}>Reset baby</Button>
      </>
    ),
    // enableColumnDragging: true,
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
    localization: MRT_Localization_ES,
    rowCount: totalRowCount,
    enableColumnFilterModes: true,
    enableColumnResizing: true,
    state: {
      columnFilterFns: search.filtersFn ?? columnsFilter,
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
