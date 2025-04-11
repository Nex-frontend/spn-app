import { HoverCard, List, Stack, Title } from '@mantine/core';
import { IconList, ServerBadge } from '~/features/ui';

interface Props {
  status: string | null;
  name: string;
  fortnight: string | null;
}

export const BadgeFortnightSicon = ({ status, name, fortnight }: Props) => {
  return (
    <HoverCard width={280}>
      <HoverCard.Target>
        <ServerBadge>{fortnight} - SICON</ServerBadge>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Stack align="flex-start" justify="center" gap="md">
          <Title order={4}>Quincena en Cargar tablas - SICON</Title>
          <List spacing="xs" size="sm" center icon={<IconList type="success" />}>
            <List.Item>
              Quincena: <span className="font-bold">{fortnight}</span>
            </List.Item>
            <List.Item>
              Estatus: <span className="font-bold">{status}</span>
            </List.Item>
            <List.Item>
              Nombre: <span className="font-bold">{name}</span>
            </List.Item>
          </List>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
