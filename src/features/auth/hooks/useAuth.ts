import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { serverFn } from '~/server/functions';

export const useAuth = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: useServerFn(serverFn.auth.signIn),
    onSuccess: async () => {
      queryClient.resetQueries();
      await router.invalidate({ sync: true });
    },
  });
};
