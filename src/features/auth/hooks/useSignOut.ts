import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { serverFn } from '../../../server/functions/index';
import { authKeys } from '../query';

export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: useServerFn(serverFn.auth.signOut),
    onSuccess: async () => {
      queryClient.resetQueries({ queryKey: authKeys.all });
      await router.invalidate({ sync: true });
    },
  });
};
