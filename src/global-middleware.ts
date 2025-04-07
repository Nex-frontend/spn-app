import { registerGlobalMiddleware } from '@tanstack/react-start';
import { errorMiddleware } from './lib/middleware/error.middleware';

registerGlobalMiddleware({
  middleware: [errorMiddleware],
});
