import { auth } from '..';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest, setHeader } from '@tanstack/react-start/server';
import { auth as betterAuth } from '~/lib/auth';
import { errorMiddleware } from '~/lib/middleware';
import { ErrorApp } from '~/server/core';
import { LoginSchema } from '~/shared';

export const signIn = createServerFn({ method: 'POST' })
  .middleware([errorMiddleware])
  .validator(LoginSchema)
  .handler(async ({ data }) => {
    const response = await auth.cases.signIn(data);
    setHeader('set-cookie', response.headers.getSetCookie());

    if (response.status !== 200) {
      throw ErrorApp.badRequest('Credenciales Incorrectas');
    }
  });

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const request = getWebRequest();

  if (!request?.headers) {
    throw new Error('No se encontró la sesión');
  }

  const response = await auth.cases.signOut(request?.headers);
  setHeader('set-cookie', response.headers.getSetCookie());
  if (!response.ok) {
    throw new Error('Ocurrio un error al momento de cerrar la sesión');
  }
});

export const getUser = createServerFn({ method: 'GET' })
  // .middleware([errorMiddleware])
  .handler(async () => {
    try {
      const { headers } = getWebRequest()!;
      const session = await betterAuth.api.getSession({ headers });

      return session?.user || null;
    } catch (error) {
      return null;
    }
  });
