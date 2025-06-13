import * as v from 'valibot';
import { getSearchSchema } from '../pagination';

export const RefundUpdateNotesSchema = v.object({
  id: v.pipe(v.number(), v.toMinValue(1), v.integer()),
  notes: v.fallback(v.pipe(v.string(), v.trim()), ''),
});

export const RefundSearchSchema = getSearchSchema('processFortnight');

export type RefundUpdateNotesSchemaI = v.InferOutput<typeof RefundUpdateNotesSchema>;
