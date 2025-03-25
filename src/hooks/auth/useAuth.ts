import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { signIn } from '~/server/functions/auth/auth.function';
import { keys } from '~/utils';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: useServerFn(signIn),
    onSuccess: async () => {
      queryClient.resetQueries({ queryKey: [keys.auth.AUTH_USER] });
      await router.invalidate({ sync: true });
      router.navigate({ to: '/' });
    },
  });
};
