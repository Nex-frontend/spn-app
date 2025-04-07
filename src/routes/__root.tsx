import * as React from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import mantineCssUrl from '@mantine/core/styles.css?url';
import { Notifications } from '@mantine/notifications';
import notificationCssUrl from '@mantine/notifications/styles.css?url';
import { authQueryOptions } from '~/features/auth';
import { controlProcessQueryOptions } from '~/features/controlProcess';
import { DefaultCatchBoundary, NotFound } from '~/features/core';
import { serverFn } from '~/server/functions';
// import appCssUrl from '~/styles/app.css?url';
import '~/styles/app.css';

import linksCssUrl from '~/styles/links-groups.css?url';
import sidebarCssUrl from '~/styles/sidebar.css?url';
import { seo } from '~/utils/seo';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: Awaited<ReturnType<typeof serverFn.auth.getUser>>;
  initialSiapsep: Awaited<ReturnType<typeof serverFn.controlProcess.getFortnight>>;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(authQueryOptions());

    const initialSiapsep = await context.queryClient.fetchQuery(
      controlProcessQueryOptions({ enabled: !!user })
    );

    return { user, initialSiapsep };
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
        title: 'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: mantineCssUrl },
      { rel: 'stylesheet', href: notificationCssUrl },
      { rel: 'stylesheet', href: sidebarCssUrl },
      { rel: 'stylesheet', href: linksCssUrl },
      // { rel: 'stylesheet', href: appCssUrl },
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

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" {...mantineHtmlProps}>
      <head>
        <HeadContent />
        <ColorSchemeScript nonce="8IBTHwOdqNKAWeKl7plt8g==" defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications position="top-right" limit={4} />
          {children}
        </MantineProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
