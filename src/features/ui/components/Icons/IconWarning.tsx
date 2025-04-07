import { IconAlertCircle, IconProps } from '@tabler/icons-react';

interface Props extends IconProps {}

export const IconWarning = (props: Props) => {
  return <IconAlertCircle {...props} />;
};
