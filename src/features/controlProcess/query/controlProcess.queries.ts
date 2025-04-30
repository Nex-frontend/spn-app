import { queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';

export const controlProcessKeys = {
  all: ['siapsep_status'] as const,
};

export const controlProcessQueries = {
  fortnight: () =>
    queryOptions({
      queryKey: controlProcessKeys.all,
      queryFn: serverFn.controlProcess.getFortnight,
    }),
};
