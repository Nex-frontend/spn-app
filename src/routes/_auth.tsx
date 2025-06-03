import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SignOutButton } from '~/features/auth';
import { controlProcessQueries } from '~/features/controlProcess';
import { controlSiconQueries } from '~/features/controlSicon';
import { GroupServerBadge, MainHeader, Searchbar, SideBarMenu, SkeletonBadge } from '~/features/ui';

export const Route = createFileRoute('/_auth')({
  component: DashboardLayout,
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/signin',
        search: {
          redirectTo: location.href,
        },
      });
    }

    context.queryClient.prefetchQuery(controlProcessQueries.fortnight());
    context.queryClient.prefetchQuery(controlSiconQueries.fortnight());

    return { crumb: 'Dashboard', iconName: 'home' };
  },
  head: () => ({
    meta: [
      {
        title: 'Dashboard | SPN',
      },
    ],
  }),
});

function DashboardLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 250 },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <Group visibleFrom="sm">
            <GroupServerBadge />
          </Group>
          <Searchbar />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section
          hiddenFrom="sm"
          className="flex flex-row flex-wrap gap-2 justify-start items-center"
        >
          <GroupServerBadge />
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <SideBarMenu />
        </AppShell.Section>
        <AppShell.Section>
          <SignOutButton />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <MainHeader />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
