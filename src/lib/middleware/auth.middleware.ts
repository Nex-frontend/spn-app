import { createMiddleware } from '@tanstack/react-start';
import { getRequest, setResponseStatus } from '@tanstack/react-start/server';
import { auth } from '~/lib/auth';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const request = getRequest();
    if (!request) {
      setResponseStatus(500);
      throw new Error('Internal server error');
    }

    const { headers } = request;

    const session = await auth.api.getSession({
      headers,
      query: {
        disableCookieCache: true,
      },
    });

    // FIXME: THIS IS CAUSING PROBLEMS WITH VITE, REVIEW WHAT THE HELL IS GOING ON
    // if (!session || !session.user) {
    //   setResponseStatus(401);
    // throw new Error('Unauthorized');
    // }

    return next({ context: { user: session?.user } });
  } catch (error) {
    throw error;
  }
});
