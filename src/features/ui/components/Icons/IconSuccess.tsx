import { IconCircleCheck, IconProps } from '@tabler/icons-react';

interface Props extends IconProps {}

export const IconSuccess = (props: Props) => {
  return <IconCircleCheck {...props} />;
};
