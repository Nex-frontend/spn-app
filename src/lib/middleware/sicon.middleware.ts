import { createMiddleware } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { controlSicon } from '~/server/features/controlSicon';

export const siconMiddleware = (moduleName: string) =>
  createMiddleware().server(async ({ next }) => {
    const siconFornight = await controlSicon.cases.getFortnightByModule(moduleName);

    if (siconFornight.error) {
      setResponseStatus(500);
      throw new Error('El sicon esta offline');
    }

    return next({ context: { siconFornight: siconFornight.module } });
  });
