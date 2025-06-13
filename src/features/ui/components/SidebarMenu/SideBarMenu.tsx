import { useMemo } from 'react';
import { useChildMatches } from '@tanstack/react-router';
import { LinksGroup } from '../LinksGroup/LinksGroups';
import { getMenuLinks } from '~/utils';

export const SideBarMenu = () => {
  const menuLinks = useMemo(() => getMenuLinks(), []);
  const childMatches = useChildMatches();

  const linksN = useMemo(() => {
    const childRoute = childMatches.length > 0 ? childMatches[0].routeId : '';

    return menuLinks.map((menu) => (
      <LinksGroup
        {...menu}
        key={menu.label}
        initiallyOpened={menu?.matchRoute ? childRoute.includes(menu.matchRoute) : false}
      />
    ));
  }, []);

  return <>{linksN}</>;
};

export default SideBarMenu;
