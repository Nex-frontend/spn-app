import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { DefaultCatchBoundary } from './features/core/components/DefaultCatchBoundary';
import { NotFound } from './features/core/components/NotFound';
import { routeTree } from './routeTree.gen';
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

const initialSiapsep = {
  online: false,
  error: 'No ha inicializado',
  ordinaryFortnight: {
    fortnight: 0,
    status: '',
  },
  currentFortnight: {
    fortnight: 0,
    consecutive: 0,
    status: '',
  },
};

const initialSicon = {
  online: false,
  error: 'No ha inicitalizado',
  module: {
    id: 0,
    status: '',
    fortnight: '',
    name: '',
  },
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
    queryCache: new QueryCache({
      onError: (error) => {
        console.log({ errorQuery: error });
        const message = handleErrorMessage(error.message);
        return toast.error(message);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.log({ errorMutation: error });
        const message = handleErrorMessage(error.message);
        return toast.error(message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }),
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient, user: null, initialSiapsep, initialSicon },
      defaultPreload: 'intent',
      // react-query will handle data fetching & caching
      // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
      defaultPreloadStaleTime: 0,
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,
      scrollRestoration: true,
      defaultStructuralSharing: true,
    }),
    queryClient
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
