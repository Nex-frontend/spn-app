import { useSuspenseQuery } from '@tanstack/react-query';
import { controlSiconQueries } from '../query';
import { BadgeFortnightSicon } from './BadgeFortnightSicon';
import { ErrorServerBadge } from '~/features/ui';

export const InititalSicon = () => {
  const { data, refetch, isFetching } = useSuspenseQuery(controlSiconQueries.fortnight());

  if (data.error || !data?.online) {
    return <ErrorServerBadge isFetching={isFetching} refetch={refetch} label="SICON Offline" />;
  }

  return <BadgeFortnightSicon {...data.module} />;
};
