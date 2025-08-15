import { createMiddleware } from '@tanstack/react-start';
import { handlerError } from '~/shared';

export const errorMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  try {
    const result = await next();
    return result;
  } catch (error) {
    console.log({ errorMiddleware: error });
    throw handlerError(error);
  }
});
