import { useSuspenseQuery } from '@tanstack/react-query';
import { Group } from '@mantine/core';
import { BadgeFortnightSiapsep } from './BadgeFortnightSiapsep';
import { controlProcessQueryOptions } from '~/features/controlProcess';
import { AppBadge, IconServerError } from '~/features/ui';

export const InititalSiapsep = () => {
  const { data } = useSuspenseQuery(controlProcessQueryOptions({ enabled: true }));

  if (data.error || !data?.online) {
    return (
      <AppBadge type="error" leftSection={<IconServerError size={16} />} size="lg">
        Siapsep Offline
      </AppBadge>
    );
  }

  return (
    <Group>
      <BadgeFortnightSiapsep
        {...data.ordinaryFortnight}
        consecutive={0}
        title="Ultima Nomina Ordinaria del Control Proceso"
      />
      <BadgeFortnightSiapsep {...data.currentFortnight} title="Nomina Actual de Control Proceso" />
    </Group>
  );
};
