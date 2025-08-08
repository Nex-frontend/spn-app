import { Suspense } from 'react';
import { SkeletonBadge } from '../../../ui/components/Skeleton';
import { InititalSiapsep } from '~/features/controlProcess';
import { InititalSicon } from '~/features/controlSicon';

export const GroupServerBadge = () => {
  return (
    <>
      <Suspense fallback={<SkeletonBadge quantity={1} />}>
        <InititalSiapsep />
      </Suspense>
      <Suspense fallback={<SkeletonBadge quantity={1} />}>
        <InititalSicon />
      </Suspense>
    </>
  );
};
