import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useRefundAlerts } from '../hooks';
import { useRefundGenerateConsecutive } from '../hooks/useRefundGenerateConsecutive';
import { IconUpload, useConfirmModal } from '~/features/ui';
import { toast } from '~/utils';

export const RefundGenerateConsecutiveBtn = () => {
  const { isFetching, hasError, hasInfo } = useRefundAlerts();
  const generateConsecutive = useRefundGenerateConsecutive();

  const isDisabled = isFetching || hasError || hasInfo;
  const openModal = useConfirmModal({
    onConfirm: () => generateConsecutive.mutate({}),
    cancelText: 'Generación cancelada',
  });

  // return <Button onClick={openModal}>Open confirm modal</Button>;
  const handleClick = () => {
    openModal();
  };

  return (
    <Button
      disabled={isDisabled}
      leftSection={<IconUpload />}
      onClick={handleClick}
      loading={generateConsecutive.isPending}
    >
      Cargar consecutivo
    </Button>
  );
};
