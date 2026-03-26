import { useMemo } from 'react';
import { useChildMatches } from '@tanstack/react-router';
import { AppLink } from '../AppLink/AppLink';
import { isFunction } from '~/shared';
import { linkDefaults } from '../AppLink/helpers';

interface LinkWrapperProps {
  children: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
  matchRoute?: string;
  link?: string;
}

export const LinkWrapper = ({ link, children, matchRoute }: LinkWrapperProps) => {
  const childMatches = useChildMatches();

  const isMatch = useMemo(() => {
    if (link || !matchRoute) {
      return false;
    }
    return childMatches.some((match) => match.routeId.includes(matchRoute));
  }, [matchRoute, childMatches]);

  if (!link) {
    return isFunction(children) ? children({ isActive: isMatch }) : children;
  }

  return (
    <AppLink 
      to={link} 
      underline="never" 
      activeOptions={{ exact: true }}
      {...linkDefaults} 
    >
      {({ isActive }: { isActive: boolean }) =>
        isFunction(children)
          ? children({
              isActive,
            })
          : children
      }
    </AppLink>
  );
};
