'use client';

import { scan } from 'react-scan';
import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { nprogress } from '@mantine/nprogress';

scan({
    enabled: true,
});

export function ClientRoot({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const unsubscribeStart = router.subscribe(
            'onBeforeLoad',
            ({ fromLocation, pathChanged }) => fromLocation && pathChanged && nprogress.start()
        );
        const unsubscribeComplete = router.subscribe('onLoad', () => nprogress.complete());

        return () => {
            unsubscribeStart();
            unsubscribeComplete();
        };
    }, [router]);

    return <>{children}</>;
}