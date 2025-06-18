import { useMemo } from 'react';
import { Group, List, Popover, Stack, Title } from '@mantine/core';
import { IconList, ServerBadge } from '~/features/ui';

interface Props {
  title: string;
  fortnight: number;
  status: string;
  consecutive: number;
  error?: string;
}

export const BadgeFortnightSiapsep = ({ title, fortnight, status, consecutive, error }: Props) => {
  const badgeType = error ? 'error' : 'success';
  const badgeText = fortnight > 0 ? `${fortnight} - ${status}` : 'Error';
  const consecutiveText = useMemo(() => {
    if (consecutive < 0) return 'Invalido';
    return consecutive === 0 ? 'Ordinaria' : `Complementaria ${consecutive}`;
  }, [consecutive]);

  const Icon = useMemo(() => {
    if (error) {
      return <IconList type="error" />;
    }
    return <IconList type="success" />;
  }, [error]);

  return (
    <Group justify="center">
      <Popover width={280}>
        <Popover.Target>
          <ServerBadge type={badgeType}>{badgeText}</ServerBadge>
        </Popover.Target>
        <Popover.Dropdown>
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
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
};
