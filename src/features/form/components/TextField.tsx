import { TextInput, TextInputProps } from '@mantine/core';
import { useFieldContext } from '../context';

export function TextField(props: TextInputProps) {
  const field = useFieldContext<string>();
  return (
    <TextInput
      {...props}
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      error={
        field.state.meta.isTouched &&
        field.state.meta.errors.length &&
        field.state.meta.errors[0]?.message
      }
    />
  );
}
