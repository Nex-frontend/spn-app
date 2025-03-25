import { createServerFn } from '@tanstack/react-start';
import { setHeader } from '@tanstack/react-start/server';
import { auth } from '~/lib/auth';
import { LoginSchema } from '~/schemas';
import { useCases } from '~/server/useCases';

export const signIn = createServerFn()
  .validator(LoginSchema)
  .handler(async ({ data }) => {
    const response = await useCases.auth.signIn(data);
    setHeader('set-cookie', response.headers.getSetCookie());

    if (response.status !== 200) {
      throw new Error('Credenciales Incorrectas');
    }
  });
