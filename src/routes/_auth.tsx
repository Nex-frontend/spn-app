import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
} from '@tabler/icons-react';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import FeaturesCard from '~/components/ui/FeaturesCard/FeaturesCard';
import { LinksGroup } from '~/components/ui/LinksGroup/LinksGroups';
import { authClient } from '~/lib/utils/authClient';
import { keys } from '~/utils';

export const Route = createFileRoute('/_auth')({
  component: DashboardLayout,
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

const mockdataLink = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Market news',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

function DashboardLayout() {
  const { queryClient } = Route.useRouteContext();
  // const { user } = Route.useLoaderData();

  // const { user } = Route.useRouteContext();
  const router = useRouter();
  const linksN = mockdataLink.map((item) => <LinksGroup {...item} key={item.label} />);

  // console.log({ user });

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 250, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          {/* <MantineLogo size={30} /> */}
          <Group h="100%" gap={0} visibleFrom="sm">
            <FeaturesCard />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section></AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          {linksN}
        </AppShell.Section>
        <AppShell.Section>Navbar footer – always at the bottom</AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
