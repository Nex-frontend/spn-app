import { IconRefresh } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { IconServerError } from '../Icons';
import { AppBadge } from './AppBadge';

interface ErrorServerBadgeProps {
  isFetching: boolean;
  refetch: () => void;
  label: string;
}

export const ErrorServerBadge = ({ isFetching, refetch, label }: ErrorServerBadgeProps) => {
  return (
    <AppBadge
      type="error"
      leftSection={<IconServerError />}
      size="lg"
      rightSection={
        <ActionIcon
          variant="transparent"
          aria-label="Settings"
          size="sm"
          color="red"
          loading={isFetching}
          onClick={() => refetch()}
        >
          <IconRefresh />
        </ActionIcon>
      }
    >
      {label}
    </AppBadge>
  );
};
