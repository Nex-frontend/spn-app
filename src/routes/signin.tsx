import { createFileRoute, redirect, stripSearchParams } from '@tanstack/react-router';
import { Container, Paper, Title } from '@mantine/core';
import { SignInForm } from '~/features/auth';
import { RedirectSearchSchema } from '~/shared';

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
  validateSearch: RedirectSearchSchema,
  beforeLoad: async ({ context, search }) => {
    const { redirectTo } = search;

    if (context.user) {
      throw redirect({ to: redirectTo });
    }
  },
  search: {
    middlewares: [
      stripSearchParams({
        redirectTo: '/',
      }),
    ],
  },
});

function RouteComponent() {
  return (
    <Container size={420} my={40}>
      <Title ta="center">Bienvenido</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <SignInForm />
      </Paper>
    </Container>
  );
}
