import { useMatches } from '@tanstack/react-router';
import { Group, Title } from '@mantine/core';
import BreadCrumbs from './BreadCrumbs';

export const MainHeader = () => {
  const matches = useMatches().filter((match) => match.context?.crumb);
  const title = matches[matches.length - 1].context.crumb ?? 'SIN TITULO';

  return (
    <Group justify="space-between" pb="md">
      <Title order={3} textWrap="balance">
        {title}
      </Title>
      <BreadCrumbs crumbs={matches} key={title} />
    </Group>
  );
};
