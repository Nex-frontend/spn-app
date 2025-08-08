import { useNavigate, useRouteContext } from '@tanstack/react-router';
// import MyImage from '/Loch_Ness-big.png';
import MyImage from '/Ghost-big.png';
import { Button, Container, Group, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { AuthLayout, IconHome, IconReturn } from '~/features/ui';

export function NotFound() {
  const { user } = useRouteContext({ from: '__root__' });

  if (user) {
    return (
      <AuthLayout className="flex align-center justify-center">
        <NotFundContainer className="flex align-center justify-center" />
      </AuthLayout>
    );
  }

  return <NotFundContainer className="h-screen w-screen flex align-center justify-center" />;
}

interface Props {
  className?: string;
}

const NotFundContainer = ({ className }: Props) => {
  const navigate = useNavigate();

  const handleReturn = () => {
    window.history.back();
  };

  const handleHome = () => {
    navigate({ to: '/' });
  };

  return (
    <Container className={className} mt={10}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Stack hiddenFrom="sm" align="center" justify="center">
          <Image alt="not found error" src={MyImage} h={200} w="auto" fit="contain" />
        </Stack>
        <Stack align="center" justify="center">
          <Title>¡Buuu!</Title>
          <Text c="dimmed" size="lg">
            La página que desea acceder, no existe.
          </Text>
          <Group justify="center">
            <Button leftSection={<IconHome />} size="md" mt="xl" onClick={handleHome} color="gray">
              Ir al Inicio
            </Button>
            <Button leftSection={<IconReturn />} size="md" mt="xl" onClick={handleReturn}>
              Regresar
            </Button>
          </Group>
        </Stack>
        <Stack align="center" justify="center">
          <Image
            alt="not found error"
            src={MyImage}
            visibleFrom="sm"
            w="auto"
            fit="contain"
            mah={300}
          />
        </Stack>
      </SimpleGrid>
    </Container>
  );
};
