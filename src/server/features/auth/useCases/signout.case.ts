import { auth } from '~/lib/auth';

export const signOut = async (headers: Headers) => {
  return await auth.api.signOut({ headers, asReponse: true, returnHeaders: true });
};
