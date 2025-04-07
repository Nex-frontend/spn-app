import { useMemo } from 'react';
import { Group, HoverCard, List, Stack, Title } from '@mantine/core';
import { AppBadge, IconError, IconSuccess, IconWrapper } from '~/features/ui';

interface Props {
  title: string;
  fortnight: number;
  status: string;
  consecutive: number;
  error?: string;
}

export const BadgeFortnightSiapsep = ({ title, fortnight, status, consecutive, error }: Props) => {
  const badgeType = error ? 'error' : 'info';
  const badgeText = fortnight > 0 ? `${fortnight} - ${status}` : 'Error';
  const consecutiveText = useMemo(() => {
    if (consecutive < 0) return 'Invalido';
    return consecutive === 0 ? 'Ordinaria' : `Complementaria ${consecutive}`;
  }, [consecutive]);

  const Icon = useMemo(() => {
    if (error) {
      return (
        <IconWrapper color="red" size={24} radius="xl">
          <IconError size={16} />
        </IconWrapper>
      );
    }
    return (
      <IconWrapper color="teal" size={24} radius="xl">
        <IconSuccess size={16} />
      </IconWrapper>
    );
  }, [error]);

  return (
    <Group justify="center">
      <HoverCard width={280} shadow="md" withArrow arrowSize={10}>
        <HoverCard.Target>
          <AppBadge type={badgeType} size="lg">
            {badgeText}
          </AppBadge>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Stack align="flex-start" justify="center" gap="md">
            <Title order={4}>{title}</Title>
            <List spacing="xs" size="sm" center icon={Icon}>
              <List.Item>
                Quincena: <span className="font-bold">{fortnight}</span>
              </List.Item>
              <List.Item>
                Estatus: <span className="font-bold">{status}</span>
              </List.Item>
              <List.Item>
                Consecutivo: <span className="font-bold">{consecutiveText}</span>
              </List.Item>
              {error && <List.Item>Error: {error}</List.Item>}
            </List>
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
};
