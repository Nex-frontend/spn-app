import { Button, Group, Text } from '@mantine/core';
import { editNoteFormOptions } from '../form';
import { useRefundUpdateNotes } from '../hooks';
import { useAppForm } from '~/features/form';

export interface NotesModalProps {
  id: number;
  processFortnight: string;
  consecutive: number;
  notes: string;
  onCancel: () => void;
}
export const AddNoteForm = ({
  id,
  notes,
  consecutive,
  processFortnight,
  onCancel,
}: NotesModalProps) => {
  const updateNotesMutation = useRefundUpdateNotes();

  const form = useAppForm({
    defaultValues: {
      notes,
      id,
    },
    ...editNoteFormOptions,
    onSubmit: ({ value }) => {
      updateNotesMutation.mutate({ data: value });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      method="POST"
    >
      <Text size="sm">
        Quincena: <span className="font-bold">{processFortnight}</span>
      </Text>
      <Text size="sm">
        Consecutivo: <span className="font-bold">{consecutive}</span>
      </Text>
      <form.AppField name="notes">
        {(field) => (
          <field.TextareaField
            autosize
            minRows={2}
            label="Notas"
            placeholder="Agrega notas del consecutivo"
            data-autofocus
            required
          />
        )}
      </form.AppField>

      <Group mt="xl" justify="flex-end">
        <Button color="gray" onClick={onCancel}>
          Cancelar
        </Button>
        <form.AppForm>
          <form.SubmitButton label="Agregar Notas" isSubmitting={updateNotesMutation.isPending} />
        </form.AppForm>
      </Group>
    </form>
  );
};
