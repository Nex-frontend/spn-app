import { IconGauge, IconNotes } from '@tabler/icons-react';
import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router';
import { AppShell, Burger, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SignOut } from '~/features/auth';
import { InititalSiapsep } from '~/features/controlProcess';
import { InititalSicon } from '~/features/controlSicon';
import { FeaturesCard, LinksGroup } from '~/features/ui';

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
    label: 'Conceptos',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Reintegros', link: '/' },
      { label: 'Forte', link: '/' },
      { label: 'Inaeco', link: '/' },
    ],
  },
];

function DashboardLayout() {
  // const { user, initialSiapsep } = Route.useRouteContext();
  // const { user } = Route.useLoaderData();

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
          {/* {initialSiapsep.online && initialSiapsep.ordinaryFortnight?.fortnight} */}
          <Group>
            <InititalSiapsep />
            <InititalSicon />
          </Group>
          <Group h="100%" gap={0} visibleFrom="sm">
            <FeaturesCard />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section>Holi</AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          {linksN}
        </AppShell.Section>
        <AppShell.Section>
          <SignOut />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
