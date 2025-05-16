import { Suspense, useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import { SignOutButton } from '~/features/auth';
import { controlProcessQueries, InititalSiapsep } from '~/features/controlProcess';
import { controlSiconQueries, InititalSicon } from '~/features/controlSicon';
import { MainHeader, Searchbar, SideBarMenu, SkeletonBadge } from '~/features/ui';

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

  const isLoading = useRouterState({
    select: (s) => s.isLoading,
  });

  useEffect(() => {
    if (isLoading) {
      nprogress.start();
    }

    return () => nprogress.complete();
  }, [isLoading]);

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
            <Suspense fallback={<SkeletonBadge quantity={2} />}>
              <InititalSicon />
              <InititalSiapsep />
            </Suspense>
          </Group>
          <Searchbar />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section
          hiddenFrom="sm"
          className="flex flex-row flex-wrap gap-2 justify-start items-center"
        >
          <Suspense fallback={<SkeletonBadge quantity={2} />}>
            <InititalSiapsep />
            <InititalSicon />
          </Suspense>
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
