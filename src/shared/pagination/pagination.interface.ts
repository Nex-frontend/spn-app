export type Order = 'asc' | 'desc';

export type FilterI = {
  id: string;
  value: unknown;
}[];

export type FilterFnI = {
  [x: string]: string;
};

export interface PaginateProps {
  limit: number;
  page: number;
  orderBy: string;
  order: Order;
  filters: FilterI;
  filtersFn: FilterFnI;
}
