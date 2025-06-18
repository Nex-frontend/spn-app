import { JSX, useMemo } from 'react';
import { IconProps } from '@tabler/icons-react';
import { IconError, IconSuccess, IconWrapper } from '../Icons';

interface Props {
  type: 'error' | 'success' | 'info' | 'warning';
}

type Reference = Record<
  Props['type'],
  {
    color: string;
    Icon: (props: IconProps) => JSX.Element;
  }
>;

export const IconList = ({ type }: Props) => {
  const { color, Icon } = useMemo(() => {
    const reference: Reference = {
      error: { color: 'red', Icon: IconError },
      success: { color: 'teal', Icon: IconSuccess },
      info: { color: 'red', Icon: IconError },
      warning: { color: 'red', Icon: IconError },
    };

    return reference[type];
  }, [type]);

  return (
    <IconWrapper color={color} size={24} radius="xl">
      <Icon />
    </IconWrapper>
  );
};
