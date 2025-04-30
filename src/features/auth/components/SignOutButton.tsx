import React from 'react';
import { IconLogout } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { nprogress } from '@mantine/nprogress';
import { useSignOut } from '../hooks';

export const SignOutButton = () => {
  const signOutMutation = useSignOut();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    nprogress.start();
    e.preventDefault();
    signOutMutation.mutate(
      {},
      {
        onSuccess: () => navigate({ to: '/signin' }),
        onError: () => nprogress.complete(),
      }
    );
  };

  return (
    <a href="#" className="link" onClick={handleLogout}>
      <IconLogout className="linkIcon" stroke={1.5} />
      <span>Logout</span>
    </a>
  );
};
