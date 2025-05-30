import { UseQueryOptions } from '@tanstack/react-query';
import { RegisteredRouter, RouteById } from '@tanstack/react-router';
import { MRT_ColumnDef, MRT_Row, MRT_RowData, MRT_TableInstance } from 'mantine-react-table';
import { FilterFnI, FilterI, Order, PaginateProps, SearchSchemaI } from '~/shared';

// TODO: Study what happends here, k extends keyof ?? and ternary operation in interfaces
export type RouteIdWithSearchKeys<K extends string> = {
  [R in keyof RegisteredRouter['routesById']]: K extends keyof RouteById<
    RegisteredRouter['routeTree'],
    R
  >['types']['searchSchema']
    ? R
    : never;
}[keyof RegisteredRouter['routesById']];

export type RouteIdWithSearchPath<K extends string> = {
  [R in keyof RegisteredRouter['routesByPath']]: K extends keyof RouteById<
    RegisteredRouter['routeTree'],
    R
  >['types']['searchSchema']
    ? R
    : never;
}[keyof RegisteredRouter['routesByPath']];

type RenderDetailPanelMethod<T extends MRT_RowData> =
  | ((props: {
      internalEditComponents: React.ReactNode[];
      row: MRT_Row<T>;
      table: MRT_TableInstance<T>;
    }) => React.ReactNode)
  | undefined;

export type RequiredSearchKeys = keyof SearchSchemaI;
export type RoutesWithPageAndLimit = RouteIdWithSearchKeys<RequiredSearchKeys>;
export type RoutesWithPath = RouteIdWithSearchPath<RequiredSearchKeys>;

export interface DataPagination<T extends MRT_RowData> {
  data: T[];
  meta: { totalRowCount: number };
  error?: { message: string; code: number };
}

export type QueryKeysPagination<F extends string> = Readonly<
  [
    F,
    'list',
    {
      readonly limit: number;
      readonly page: number;
      readonly orderBy: string;
      readonly gFilter: string;
      readonly order: Order;
      readonly filters: FilterI;
      readonly filtersFn: FilterFnI;
    },
  ]
>;
type ColumnType = 'string' | 'number' | 'date' | 'boolean';
type Column<T extends MRT_RowData> = MRT_ColumnDef<T> & { type?: ColumnType };

export interface UseTableProps<T extends MRT_RowData, F extends string> {
  columns: Column<T>[];
  from: RoutesWithPageAndLimit;
  initialState: SearchSchemaI;
  getData: (
    props: PaginateProps
  ) => UseQueryOptions<DataPagination<T>, any, DataPagination<T>, QueryKeysPagination<F>>;
  renderDetailPanel?: RenderDetailPanelMethod<T>;
  enableGlobalFilter?: boolean;
  globalFilterPlaceHolder?: string;
}
