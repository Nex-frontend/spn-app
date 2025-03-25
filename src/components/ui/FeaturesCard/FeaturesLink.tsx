import React from 'react';
import { Icon, IconProps } from '@tabler/icons-react';
import { Group, Text, ThemeIcon, UnstyledButton, useMantineTheme } from '@mantine/core';

interface Props {
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  title: string;
  description: string;
}

const FeaturesLink = ({ Icon, title, description }: Props) => {
  const theme = useMantineTheme();

  return (
    <UnstyledButton className="subLink" key={title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <Icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {title}
          </Text>
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
};

export default FeaturesLink;
