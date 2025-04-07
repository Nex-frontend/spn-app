import { ThemeIcon, ThemeIconProps } from '@mantine/core';

interface Props extends ThemeIconProps {}

export const IconWrapper = (props: Props) => {
  return <ThemeIcon {...props} size={24} radius="xl" />;
};
