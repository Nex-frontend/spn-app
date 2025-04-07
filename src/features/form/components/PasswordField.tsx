import { PasswordInput, PasswordInputProps } from '@mantine/core';
import { useFieldContext } from '../context';

export function PasswordField(props: PasswordInputProps) {
  const field = useFieldContext<string>();
  return (
    <PasswordInput
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
