import { queryOptions } from '@tanstack/react-query';
import { controlProcessKeys } from './controlProcess.keys';
import { serverFn } from '~/server/functions';

interface ControlProcessQueryProps {
  enabled: boolean;
}

export const controlProcessQueryOptions = ({ enabled }: ControlProcessQueryProps) =>
  queryOptions({
    queryKey: controlProcessKeys.all,
    queryFn: ({ signal }) => serverFn.controlProcess.getFortnight({ signal }),
    enabled,
  });
