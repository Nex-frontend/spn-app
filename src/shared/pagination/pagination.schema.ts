import * as v from 'valibot';

const Order = ['desc', 'asc'] as const;
const FilterSingleValueSchema = v.pipe(v.string(), v.trim(), v.toLowerCase());
const FilterBetweenValueSchema = v.pipe(v.array(FilterSingleValueSchema), v.length(2));
const FilterSchema = v.array(
  v.object({
    id: v.pipe(v.string(), v.trim()),
    value: v.union([FilterSingleValueSchema, FilterBetweenValueSchema, v.unknown()]),
  })
);

const FilterFnSchema = v.record(v.string(), v.string());
export type FilterFnSchemaI = v.InferInput<typeof FilterFnSchema>;
export type FilterSchemaI = v.InferInput<typeof FilterSchema>;

export const getSearchSchema = (orderBy: string = 'id') =>
  v.object({
    limit: v.optional(v.fallback(v.number(), 10), 10),
    page: v.optional(v.fallback(v.number(), 0), 0),
    orderBy: v.optional(v.fallback(v.string(), orderBy), orderBy),
    order: v.optional(v.fallback(v.picklist(Order), 'desc'), 'desc'),
    filters: v.optional(v.fallback(FilterSchema, []), []),
    filtersFn: v.optional(v.fallback(FilterFnSchema, {}), {}),
  });
