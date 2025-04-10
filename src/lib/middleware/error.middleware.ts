import { createMiddleware } from '@tanstack/react-start';
import { handlerError } from '~/server/core/';

export const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const result = await next();
    return result;
  } catch (error) {
    throw handlerError(error);
  }
});
