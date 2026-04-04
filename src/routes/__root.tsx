import * as React from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { ModalsProvider } from '@mantine/modals';

// import 'dayjs/locale/es';

import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import mantineTablesCssUrl from 'mantine-react-table/styles.css?url';
import {
  Button,
  ColorSchemeScript,
  createTheme,
  HoverCard,
  mantineHtmlProps,
  MantineProvider,
  Menu,
  Popover,
  Tooltip,
} from '@mantine/core';
import mantineCssUrl from '@mantine/core/styles.css?url';
import datesCssUrl from '@mantine/dates/styles.css?url';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import nprogressCssUrl from '@mantine/nprogress/styles.css?url';
import spotlightCssUrl from '@mantine/spotlight/styles.css?url';
import { authQueries } from '~/features/auth';
import { DefaultCatchBoundary, NotFound } from '~/features/core';
import appCssUrl from '~/styles/app.css?url';

import { DatesProvider } from '@mantine/dates';
import { Nulleable } from '~/shared';
import linksCssUrl from '~/styles/links-groups.css?url';
import sidebarCssUrl from '~/styles/sidebar.css?url';
import { seo } from '~/utils';

import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  crumb: Nulleable<string>;
  iconName: Nulleable<string>;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueries.user());
    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'SPN | SEDUC',
        description: `Sistema de Productos de Nomina`,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCssUrl },
      { rel: 'stylesheet', href: mantineCssUrl },
      { rel: 'stylesheet', href: nprogressCssUrl },
      { rel: 'stylesheet', href: sidebarCssUrl },
      { rel: 'stylesheet', href: linksCssUrl },
      { rel: 'stylesheet', href: spotlightCssUrl },
      { rel: 'stylesheet', href: mantineTablesCssUrl },
      { rel: 'stylesheet', href: datesCssUrl },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

import { ClientRoot } from './-ClientRoot';

function RootComponent() {
  return (
    <RootDocument>
      <ClientRoot>
        <Outlet />
      </ClientRoot>
    </RootDocument>
  );
}

const theme = createTheme({
  defaultRadius: 'md',
  cursorType: 'pointer',
  components: {
    HoverCard: HoverCard.extend({
      defaultProps: {
        shadow: 'md',
        withArrow: true,
        arrowSize: 10,
      },
    }),
    Popover: Popover.extend({
      defaultProps: {
        shadow: 'md',
        withArrow: true,
        arrowSize: 10,
      },
    }),
    Menu: Menu.extend({
      defaultProps: {
        shadow: 'md',
        withArrow: true,
        arrowSize: 10,
        arrowPosition: 'center',
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        arrowSize: 10,
        color: '#2E2E2E',
      },
    }),
    Button: Button.extend({
      defaultProps: {
        variant: 'light',
        loaderProps: {
          type: 'dots',
        },
      },
    }),
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {

  const routerState = useRouterState();
  const prevPathnameRef = React.useRef("");

  React.useEffect(() => {
    const currentPathname = routerState.location.pathname;
    const pathnameChanged = prevPathnameRef.current !== currentPathname;

    if (pathnameChanged && routerState.status === "pending") {
      // NProgress.start();
      nprogress.start();
      prevPathnameRef.current = currentPathname;
    }

    if (routerState.status === "idle") {
      // NProgress.done();
      nprogress.complete();
    }
  }, [routerState.status, routerState.location.pathname]);

  return (
    <html lang="es" {...mantineHtmlProps}>
      <head>
        <HeadContent />
        <ColorSchemeScript nonce="8IBTHwOdqNKAWeKl7plt8g==" defaultColorScheme="dark" />
          <style>{`
          #nprogress .bar {
            background: #22c55e !important;
            height: 3px;
          }
          #nprogress .peg {
            box-shadow: 0 0 10px #22c55e, 0 0 5px #22c55e;
          }
          #nprogress .spinner-icon {
            display: none;
          }
        `}</style>
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <NavigationProgress />
          <ModalsProvider>
            <Toaster theme="dark" />
            <DatesProvider settings={{ locale: 'es', firstDayOfWeek: 0, weekendDays: [0] }}>
              {children}
            </DatesProvider>
          </ModalsProvider>
        </MantineProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
