import { registerGlobalMiddleware } from '@tanstack/react-start';
import { authMiddleware, errorMiddleware } from './lib/middleware';

registerGlobalMiddleware({
  middleware: [errorMiddleware, authMiddleware],
});
