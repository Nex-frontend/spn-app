import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { refundKeys } from '../query';
import { serverFn } from '~/server/functions';

export const useRefundUpdateNotes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: useServerFn(serverFn.refund.updateNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: refundKeys.lists() });
    },
  });
};
