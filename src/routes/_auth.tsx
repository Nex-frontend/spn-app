import { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import { SignOut } from '~/features/auth';
import { InititalSiapsep } from '~/features/controlProcess';
import { InititalSicon } from '~/features/controlSicon';
import { MainHeader, Searchbar, SideBarMenu } from '~/features/ui';

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
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const isLoading = useRouterState({
    select: (s) => s.isLoading,
  });

  console.log({ mobileOpened, desktopOpened });

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
        width: { base: 250, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
      // padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <Group>
            <InititalSiapsep />
            <InititalSicon />
          </Group>
          <Group h="100%" gap={0} visibleFrom="sm">
            {/* <FeaturesCard /> */}
            <Searchbar />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow my="md" component={ScrollArea}>
          <SideBarMenu />
        </AppShell.Section>
        <AppShell.Section>
          <SignOut />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <MainHeader />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );

  // return (
  //   <AppShell
  //     header={{ height: 60 }}
  //     navbar={{
  //       width: 300,
  //       breakpoint: 'sm',
  //       collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
  //     }}
  //     padding="md"
  //   >
  //     <AppShell.Header>
  //       <Group h="100%" px="md">
  //         <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
  //         <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
  //         {/* <MantineLogo size={30} /> */}
  //       </Group>
  //     </AppShell.Header>
  //     <AppShell.Navbar p="md">
  //       Navbar
  //       {Array(15)
  //         .fill(0)
  //         .map((_, index) => (
  //           <Skeleton key={index} h={28} mt="sm" animate={false} />
  //         ))}
  //     </AppShell.Navbar>
  //     <AppShell.Main>Main</AppShell.Main>
  //   </AppShell>
  // );
}
