/// <reference types="vinxi/types/client" />
import { scan } from 'react-scan';
import { StrictMode } from 'react';
import { StartClient } from '@tanstack/react-start';
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';

import './global-middleware';

import { nprogress } from '@mantine/nprogress';

scan({
  enabled: true,
});

const router = createRouter();

router.subscribe(
  'onBeforeLoad',
  ({ fromLocation, pathChanged }) => fromLocation && pathChanged && nprogress.start()
);
router.subscribe('onLoad', () => nprogress.complete());

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>
);
