import { useMemo } from 'react';
import { Badge, BadgeProps } from '@mantine/core';

type BadgesTypes = 'warning' | 'error' | 'success' | 'info';

interface Props extends BadgeProps {
  type?: BadgesTypes;
}

export const AppBadge = ({ type, ...restProps }: Props) => {
  const color = useMemo(() => {
    if (!type) {
      return 'blue';
    }
    const colorMap: Record<BadgesTypes, string> = {
      warning: 'yellow',
      error: 'red',
      success: 'teal',
      info: 'blue',
    };

    return colorMap[type];
  }, []);

  return <Badge {...restProps} color={color} variant="outline" />;
};
