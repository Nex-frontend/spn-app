import { useMemo, useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { PaginationState, Updater } from '@tanstack/table-core';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_SortingState,
  useMantineReactTable,
} from 'mantine-react-table';
import { ActionIcon, Tooltip } from '@mantine/core';
import { refundQueries } from '../query';
import { Route as RefundRoute } from '~/routes/_auth/(concepts)/refund';
import { getRefundLogs } from '~/server/repositories/spn/refund';

type Refunds = Awaited<ReturnType<typeof getRefundLogs>>[number];

export const RefundLogHistory = () => {
   const columns = useMemo<MRT_ColumnDef<Refunds>[]>(
    () => [
      {
        accessorKey: 'processFortnight',
        header: 'Quincena Proceso',
      },
      {
        accessorKey: 'user',
        header: 'Usuario',
      },
      // {
      //   accessorKey: 'createdAt',
      //   header: 'Fecha de Creación',
      // },
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
      },
    ],
    []
  );


  const columnsFilter =  Object.fromEntries(
        columns.map(({ accessorKey }) => [accessorKey, 'contains']),
      )
  const search = RefundRoute.useSearch();
  const navigate = useNavigate({ from: RefundRoute.fullPath });
  const { data, isLoading, isFetching, isError, refetch } = useQuery(
    refundQueries.logs({ ...search })
  );


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


  const handleFilterChange = (filters: MRT_ColumnFiltersState) => {
    const newFilters = 
      typeof filters === 'function'
         ? filters(search.filters ? [...search.filters] : [])
         : filters;

    navigate({
      search: (prev) => ({
        ...prev,
        filters: [...newFilters]
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handlerFilterFnChange = (filterFns: MRT_ColumnFilterFnsState) => {

  const newFilterFns = 
      typeof filterFns === 'function'
         ? filterFns(search.filtersFn ? search.filtersFn : columnsFilter)
         : filterFns;

      // ({ [id]: newFilterFns[id] || 'contains' }))
    
    navigate({
      search: (prev) => ({
        ...prev,
        // filtersFn: [...filteredFns]
        filtersFn: newFilterFns
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handleSortChange = (sort: MRT_SortingState) => {
      const newSort =
        typeof sort === 'function'
          ? sort([{
              id: 'id',
              desc: true,
            }])
          : sort;
        
    navigate({
      search: (prev) => ({
        ...prev,
        orderBy: newSort[0].id,
        order: newSort[0].desc ? 'desc': 'asc'
      }),
        replace: true,
        resetScroll: false,
      });
  } 

  const fetchedRefunds = data?.data ?? [];
  const totalRowCount =  data?.meta.totalRowCount ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedRefunds, 
    renderTopToolbarCustomActions: () => (
      <Tooltip label="Refresh Data">
        <ActionIcon onClick={() => refetch()}>
          <IconRefresh />
        </ActionIcon>
      </Tooltip>
    ),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortChange,
    onColumnFilterFnsChange: handlerFilterFnChange,
    // onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: handleFilterChange,
    rowCount: totalRowCount,
    enableColumnFilterModes: true,
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

  // if (isError) {
  //   return (
  //     <div>
  //       <p>Ocurrió un error al cargar los datos. Por favor, intenta nuevamente.</p>
  //       <Button onClick={() => refetch()}>Reintentar</Button>
  //     </div>
  //   );
  // }

  return <MantineReactTable table={table} />;
};
