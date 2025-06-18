import { createMiddleware } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { controlProcess } from '~/server/features/controlProcessFortnight';

export const siapsepMiddleware = createMiddleware().server(async ({ next }) => {
  const siapsepFortnight = await controlProcess.cases.getSiapsepInitialData();

  if (siapsepFortnight.error) {
    setResponseStatus(500);
    throw new Error('El siapsep esta offline');
  }

  return next({ context: { siapsepFortnight: siapsepFortnight.ordinaryFortnight } });
});
