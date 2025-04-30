import { Skeleton as SkeletonMantine, SkeletonProps as SkeletonMantineProps } from '@mantine/core';

interface SkeletonProps extends SkeletonMantineProps {}

export const Skeleton = (props: SkeletonProps) => {
  return <SkeletonMantine {...props} />;
};
