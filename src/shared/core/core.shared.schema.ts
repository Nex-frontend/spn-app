import * as v from 'valibot';

export const RedirectSearchSchema = v.object({
  redirectTo: v.optional(v.fallback(v.pipe(v.string(), v.trim()), '/'), '/'),
});
