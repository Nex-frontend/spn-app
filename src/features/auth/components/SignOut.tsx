import React from 'react';
import { IconLogout } from '@tabler/icons-react';
import { useSignOut } from '../hooks';

export const SignOut = () => {
  const signOutMutation = useSignOut();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    signOutMutation.mutate({});
  };

  return (
    <a href="#" className="link" onClick={handleLogout}>
      <IconLogout className="linkIcon" stroke={1.5} />
      <span>Logout</span>
    </a>
  );
};
