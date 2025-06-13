import { formOptions } from '@tanstack/react-form';
import { RefundUpdateNotesSchema } from '~/shared';

export const editNoteFormOptions = formOptions({
  validators: {
    onChange: RefundUpdateNotesSchema,
  },
});
