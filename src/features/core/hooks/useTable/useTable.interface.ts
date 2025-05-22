import { UseQueryOptions } from '@tanstack/react-query';
import { RegisteredRouter, RouteById } from '@tanstack/react-router';
import { MRT_ColumnDef, MRT_RowData } from 'mantine-react-table';
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

export type RequiredSearchKeys = keyof SearchSchemaI;
export type RoutesWithPageAndLimit = RouteIdWithSearchKeys<RequiredSearchKeys>;
export type RoutesWithPath = RouteIdWithSearchPath<RequiredSearchKeys>;

export interface DataPagination<T extends MRT_RowData> {
  data: T[];
  meta: { totalRowCount: number };
}

export type QueryKeysPagination<F extends string> = Readonly<
  [
    F,
    'list',
    {
      readonly limit: number;
      readonly page: number;
      readonly orderBy: string;
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
  fullPath: RoutesWithPath;
  initialState: SearchSchemaI;
  getData: (
    props: PaginateProps
  ) => UseQueryOptions<DataPagination<T>, any, DataPagination<T>, QueryKeysPagination<F>>;
}
