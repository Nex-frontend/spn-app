import { Icon, IconProps } from '@tabler/icons-react';

export const withSizeIcon = (Icon: Icon) => {
  return (props: IconProps) => <Icon size={16} {...props} />;
};
