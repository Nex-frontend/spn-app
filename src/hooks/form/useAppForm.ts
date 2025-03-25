import { createFormHook } from '@tanstack/react-form';
import { PasswordField, SubscribeButton, TextField } from '~/components/form';
import { fieldContext, formContext } from '~/utils';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {
    SubscribeButton,
  },
});
