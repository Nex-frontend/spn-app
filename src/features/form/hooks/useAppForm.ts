import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from '../context';
import { PasswordField, SubmitButton, TextField } from '~/features/form/components';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {
    SubmitButton,
  },
});
