import * as auth from '../features/auth/functions';
import * as controlProcess from '../features/controlProcessFortnight/functions';

export const serverFn = {
  auth: { ...auth },
  controlProcess: { ...controlProcess },
};
