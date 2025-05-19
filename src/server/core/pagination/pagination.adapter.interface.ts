import { SQL } from 'drizzle-orm';
import { PgColumn, PgSelect, PgTable } from 'drizzle-orm/pg-core';
import { FilterFnI, FilterI, Order } from '~/shared';

export type SchemaI = PgTable & { id: PgColumn };
export type OrderColumnI = PgColumn | SQL | SQL.Aliased | string;
export type OrderColumnPg = Exclude<OrderColumnI, string>;

export interface WithPaginateProps {
  schema: SchemaI;
  limit: number;
  page: number;
  joinSchemas?: JoinSchemas;
  orderBy?: OrderColumnI;
  order?: Order;
  filters?: FilterI;
  filtersFn?: FilterFnI;
}

export type OrderByProps = Pick<WithPaginateProps, 'order' | 'orderBy' | 'schema' | 'joinSchemas'>;

export type CountProps = Pick<WithPaginateProps, 'schema' | 'joinSchemas'> & { filters: SQL[] };

export type AddPaginateProps<T extends PgSelect> = Pick<WithPaginateProps, 'page' | 'limit'> & {
  qb: T;
  orderColumn: OrderColumnPg;
};

export type Joins = 'leftJoin' | 'leftJoin' | 'leftJoin';

export interface ExtraSchemas {
  schema: SchemaI;
  fieldJoin: PgColumn;
  fieldFrom: PgColumn;
  type: Joins;
}

export type JoinSchemas = Record<string, ExtraSchemas>;

export type GetFiltersProps = Required<
  Pick<WithPaginateProps, 'filters' | 'filtersFn' | 'schema'>
> &
  Pick<WithPaginateProps, 'joinSchemas'>;

export type GetFilterSchema = Pick<GetFiltersProps, 'schema' | 'joinSchemas'> & { id: string };
