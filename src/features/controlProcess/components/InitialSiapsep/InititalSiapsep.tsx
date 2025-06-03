import { useSuspenseQuery } from '@tanstack/react-query';
import { BadgeFortnightSiapsep } from './BadgeFortnightSiapsep';
import { controlProcessQueries } from '~/features/controlProcess';
import { ErrorServerBadge } from '~/features/ui';

export const InititalSiapsep = () => {
  const { data, refetch, isFetching } = useSuspenseQuery(controlProcessQueries.fortnight());

  if (data.error || !data?.online) {
    return <ErrorServerBadge isFetching={isFetching} refetch={refetch} label="SIAPSEP Offline" />;
  }

  return (
    <>
      <BadgeFortnightSiapsep
        {...data.ordinaryFortnight}
        consecutive={0}
        title="Ultima Nomina Ordinaria del Control Proceso - SIAPSEP"
      />
      <BadgeFortnightSiapsep
        {...data.currentFortnight}
        title="Nomina Actual de Control Proceso - SIAPSEP"
      />
    </>
  );
};
