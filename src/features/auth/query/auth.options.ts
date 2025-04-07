import { queryOptions } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { serverFn } from '~/server/functions';

export const authQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.all,
    queryFn: ({ signal }) => serverFn.auth.getUser({ signal }),
  });
