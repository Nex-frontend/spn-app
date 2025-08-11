import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { toast } from '~/utils';

interface UseConfirmModal {
  onConfirm: () => void;
  title?: string;
  body?: string;
  cancelText?: string;
}

export const useConfirmModal = ({ onConfirm, title, body, cancelText }: UseConfirmModal) => {
  const exactTitle = title || 'Por favor confirmar esta acción';
  const exactBody =
    body ||
    'Esta acción es tan importante que se requiere confirmarla. Por favor, haga clic en uno de estos botones para continuar.';

  const exactCancelText = cancelText || 'Petición cancelada';

  const openModal = () =>
    modals.openConfirmModal({
      title: exactTitle,
      children: <Text size="sm">{exactBody}</Text>,
      labels: { confirm: 'Generar', cancel: 'Cancelar' },
      onCancel: () => toast.info(exactCancelText),
      onConfirm: () => onConfirm(),
    });

  return openModal;
};
