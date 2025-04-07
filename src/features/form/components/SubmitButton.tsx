import { Button, ButtonProps } from '@mantine/core';

interface Props extends ButtonProps {
  label: string;
  isSubmitting: boolean;
}

export function SubmitButton({ label, isSubmitting, ...rest }: Props) {
  // const form = useFormContext();
  return (
    <Button {...rest} loading={isSubmitting} disabled={isSubmitting} type="submit">
      {label}
    </Button>
  );
}
// export function SubscribeButton({ label, ...rest }: Props) {
//   const form = useFormContext();
//   return (
//     <form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
//       {([canSubmit, isSubmitting]) => (
//         <Button {...rest} loading={isSubmitting} disabled={!canSubmit} type="submit">
//           {label}
//         </Button>
//       )}
//     </form.Subscribe>
//   );
// }
