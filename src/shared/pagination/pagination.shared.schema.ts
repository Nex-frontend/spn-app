import * as v from 'valibot';

const Order = ['desc', 'asc'] as const;
const FilterSingleValueSchema = v.pipe(v.string(), v.trim(), v.toLowerCase());
const FilterBetweenValueSchema = v.pipe(
  v.array(v.optional(FilterSingleValueSchema, '')),
  v.length(2)
);
const FilterSchema = v.array(
  v.object({
    id: v.pipe(v.string(), v.trim()),
    value: v.union([FilterSingleValueSchema, FilterBetweenValueSchema, v.string()]),
    key: v.optional(v.string(), ''),
  })
);
const OrderSchema = v.picklist(Order);
const FilterFnSchema = v.record(v.string(), v.string());

export const getSearchSchema = (orderBy: string = 'id') =>
  v.object({
    limit: v.optional(v.fallback(v.number(), 10), 10),
    page: v.optional(v.fallback(v.number(), 0), 0),
    gFilter: v.optional(v.fallback(v.pipe(v.string(), v.trim()), ''), ''),
    orderBy: v.optional(v.fallback(v.pipe(v.string(), v.trim()), orderBy), orderBy),
    order: v.optional(v.fallback(OrderSchema, 'desc'), 'desc'),
    filters: v.optional(v.fallback(FilterSchema, []), []),
    filtersFn: v.optional(v.fallback(FilterFnSchema, {}), {}),
  });

export type FilterFnSchemaI = v.InferOutput<typeof FilterFnSchema>;
export type FilterSchemaI = v.InferOutput<typeof FilterSchema>;
export type OrderSchemaI = v.InferOutput<typeof OrderSchema>;
export type SearchSchemaI = v.InferOutput<ReturnType<typeof getSearchSchema>>;
