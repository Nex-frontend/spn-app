import { queryOptions } from '@tanstack/react-query';
import { serverFn } from '~/server/functions';

export const authKeys = {
  all: ['auth'] as const,
};

export const authQueries = {
  user: () =>
    queryOptions({
      queryKey: authKeys.all,
      queryFn: serverFn.auth.getUser,
    }),
};
