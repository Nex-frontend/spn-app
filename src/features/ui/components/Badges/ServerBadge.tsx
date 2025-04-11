import { IconServer } from '@tabler/icons-react';
import { AppBadge, AppBadgeProps } from './AppBadge';

interface Props extends AppBadgeProps {}

export const ServerBadge = (props: Props) => {
  return (
    <AppBadge
      type="success"
      size="lg"
      visibleFrom="xs"
      leftSection={<IconServer size={19} />}
      {...props}
    />
  );
};
