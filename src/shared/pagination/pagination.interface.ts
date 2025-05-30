export type Order = 'asc' | 'desc';

export type FilterI = {
  id: string;
  value: unknown;
  key: string;
}[];

export type FilterFnI = {
  [x: string]: string;
};

export interface PaginateProps {
  limit: number;
  page: number;
  orderBy: string;
  gFilter: string;
  order: Order;
  filters: FilterI;
  filtersFn: FilterFnI;
}

export type FiltersTypes =
  | 'between'
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqualTo'
  | 'lessThan'
  | 'lessThanOrEqualTo'
  | 'startsWith'
  | 'endsWith'
  | 'contains';

export type NumberFilterTypes = Extract<
  FiltersTypes,
  | 'between'
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqualTo'
  | 'lessThan'
  | 'lessThanOrEqualTo'
>;

export type StringFilterTypes = Extract<
  FiltersTypes,
  'startsWith' | 'endsWith' | 'contains' | 'equals' | 'notEquals'
>;

export type BooleanFilterTypes = Extract<FiltersTypes, 'equals'>;
