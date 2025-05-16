import { PaginateProps } from './pagination.interface';

export const DEFAULT_SEARCH_VALUES: PaginateProps = {
  limit: 10,
  page: 0,
  orderBy: 'id',
  order: 'desc',
  filters: [],
  filtersFn: {},
};
