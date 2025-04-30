import { Skeleton } from './Skeleton';

interface SkeletonProps {
  quantity?: number;
}

export function SkeletonBadge({ quantity = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: quantity }).map((_, index) => (
        <Skeleton key={index} height={20} radius="xl" width={100} />
      ))}
    </>
  );
}
