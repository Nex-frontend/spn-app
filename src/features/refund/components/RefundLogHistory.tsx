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
  const search = RefundRoute.useSearch();
  const navigate = useNavigate({ from: RefundRoute.fullPath });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const { data, isLoading, isFetching, isError, refetch } = useQuery(
    refundQueries.logs({ limit: search.limit, page: search.page })
  );

  console.log({ sorting });

  const handlePaginationChange = (pagination: Updater<PaginationState>) => {
    const newPagination =
      typeof pagination === 'function'
        ? pagination({
            pageIndex: search.page,
            pageSize: search.limit,
          })
        : pagination;

    // if (search.page === newPagination.pageIndex + 1) return;

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

  const fetchedRefunds = data ?? [];

  const table = useMantineReactTable({
    columns,
    data: fetchedRefunds, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    renderTopToolbarCustomActions: () => (
      <Tooltip label="Refresh Data">
        <ActionIcon onClick={() => refetch()}>
          <IconRefresh />
        </ActionIcon>
      </Tooltip>
    ),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: handlePaginationChange,
    state: {
      isLoading,
      pagination: {
        pageIndex: search.page,
        pageSize: search.limit,
      },
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
