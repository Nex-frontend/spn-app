import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { DefaultCatchBoundary } from './features/core/components/errors/DefaultCatchBoundary';
import { NotFound } from './features/core/components/errors/NotFound';
import { routeTree } from './routeTree.gen';
import { isObject } from './shared';
import { toast } from './utils';

const handleErrorMessage = (errorMessage?: string) => {
  if (!errorMessage) {
    return 'Error inmanegable, favor de verificar los logs';
  }

  if (errorMessage.length > 100) {
    return 'Error demasiado largo, favor de verificar los logs';
  }

  return errorMessage;
};

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
        retry: 0,
      },
    },
    // queryCache: new QueryCache({
    //   onError: (error) => {
    //     console.log({ errorQuery: error });
    //     const message = handleErrorMessage(error.message);
    //     return toast.error(message);
    //   },
    // }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.log({ errorMutation: error });
        const message = handleErrorMessage(error.message);
        return toast.error(message);
      },
      onSuccess: (data: { message: string } | unknown) => {
        const message =
          isObject(data) && typeof (data as any)?.message === 'string'
            ? (data as { message: string }).message
            : '';

        if (message) {
          return toast.success(message);
        }
      },
    }),
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: {
        queryClient,
        crumb: null,
        iconName: null,
      },
      defaultPreload: 'intent',
      defaultPreloadStaleTime: 0,
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,
      scrollRestoration: true,
      defaultStructuralSharing: true,
      notFoundMode: 'fuzzy',
    }),
    queryClient
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
