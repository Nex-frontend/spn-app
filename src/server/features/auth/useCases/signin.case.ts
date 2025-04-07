import { auth } from '~/lib/auth';
import { LoginData } from '~/schemas';

export const signIn = async (data: LoginData) => {
  return await auth.api.signInEmail({
    body: data,
    asResponse: true,
  });
};
