import { ReactElement, useState } from 'react';
import { Alert as AlertMantine, AlertProps as AlertMantineProps } from '@mantine/core';
import { IconError, IconInfo, IconSuccess, IconWarning } from '../Icons';

interface AlertProps extends AlertMantineProps {
  type?: 'default' | 'info' | 'success' | 'warning' | 'error';
  isDissmisible?: boolean;
}

const alertTypes: Record<NonNullable<AlertProps['type']>, { icon: ReactElement; color: string }> = {
  default: { icon: <IconInfo />, color: 'blue' },
  info: { icon: <IconInfo />, color: 'blue' },
  success: { icon: <IconSuccess />, color: 'green' },
  warning: { icon: <IconWarning />, color: 'yellow' },
  error: { icon: <IconError />, color: 'red' },
};

export const Alert = ({ type = 'default', isDissmisible, ...restProps }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { icon, color } = alertTypes[type];

  const handleClose = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <AlertMantine
      variant="light"
      icon={icon}
      color={color}
      withCloseButton={isDissmisible}
      onClose={handleClose}
      {...restProps}
    />
  );
};
