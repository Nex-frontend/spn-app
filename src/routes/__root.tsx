import * as React from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import mantineCssUrl from '@mantine/core/styles.css?url';
import { Notifications } from '@mantine/notifications';
import notificationCssUrl from '@mantine/notifications/styles.css?url';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';
import { getFornight } from '~/server/features/controlProcessFortnight/functions/controlProcess.function';
import { getUser } from '~/server/functions/auth/auth.function';
import linksCssUrl from '~/styles/links-groups.css?url';
import sidebarCssUrl from '~/styles/sidebar.css?url';
import { keys } from '~/utils';
import { seo } from '~/utils/seo';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: Awaited<ReturnType<typeof getUser>>;
  fortnight: Awaited<ReturnType<typeof getFornight>>;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: [keys.auth.AUTH_USER],
      queryFn: ({ signal }) => getUser({ signal }),
    });

    let fortnight: null | number = 0;
    if (user) {
      const test = await context.queryClient.fetchQuery({
        queryKey: ['fortnight'],
        queryFn: ({ signal }) => getFornight({ signal }),
      });

      fortnight = test;
    }

    return { user, fortnight };
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
