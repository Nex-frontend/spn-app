import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { serverFn } from '../../../server/functions/index';

export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: useServerFn(serverFn.auth.signOut),
    onSuccess: async () => {
      await router.invalidate({ sync: true });
      router.navigate({ to: '/signin' });
    },
  });
};
