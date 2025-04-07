import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
} from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Group,
  HoverCard,
  SimpleGrid,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { FeaturesLink } from './FeaturesLink';

const mockdata = [
  {
    Icon: IconCode,
    title: 'Open source',
    description: 'This Pokémon’s cry is very loud and distracting',
  },
  {
    Icon: IconCoin,
    title: 'Free for everyone',
    description: 'The fluid of Smeargle’s tail secretions changes',
  },
  {
    Icon: IconBook,
    title: 'Documentation',
    description: 'Yanma is capable of seeing 360 degrees without',
  },
  {
    Icon: IconFingerprint,
    title: 'Security',
    description: 'The shell’s rounded shape and the grooves on its.',
  },
  {
    Icon: IconChartPie3,
    title: 'Analytics',
    description: 'This Pokémon uses its flying ability to quickly chase',
  },
  {
    Icon: IconNotification,
    title: 'Notifications',
    description: 'Combusken battles with the intensely hot flames it spews',
  },
];

export const FeaturesCard = () => {
  const theme = useMantineTheme();

  return (
    <HoverCard width={500} position="bottom" radius="md" shadow="md" withinPortal>
      <HoverCard.Target>
        <a href="#" className={'link'}>
          <Center inline>
            <Box component="span" mr={5}>
              Features
            </Box>
            <IconChevronDown size={16} color={theme.colors.blue[6]} />
          </Center>
        </a>
      </HoverCard.Target>

      <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
        <Group justify="space-between" px="md">
          <Text fw={500}>Features</Text>
          <Anchor href="#" fz="xs">
            View all
          </Anchor>
        </Group>

        <Divider my="sm" />

        {
          <SimpleGrid cols={2} spacing={0}>
            {mockdata.map((item) => (
              <FeaturesLink {...item} key={item.title} />
            ))}
          </SimpleGrid>
        }

        <div className="dropdownFooter">
          <Group justify="space-between">
            <div>
              <Text fw={500} fz="sm">
                Get started
              </Text>
              <Text size="xs" c="dimmed">
                Their food sources have decreased, and their numbers
              </Text>
            </div>
            <Button variant="default">Get started</Button>
          </Group>
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
