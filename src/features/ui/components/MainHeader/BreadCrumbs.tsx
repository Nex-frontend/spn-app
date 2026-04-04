import { useMemo } from 'react';
import { Breadcrumbs as BreadcrumbsMantine } from '@mantine/core';
import { AppButtonLink, linkDefaults } from '../AppLink';
import { IconConcept, IconHome, IconControl, IconUsers, IconChart } from '../Icons';
import { Nulleable } from '~/shared';

interface BreadCrumbsContextProps {
  context: { crumb?: string | null; iconName?: string | null; };
  pathname: string;
}

interface BreadCrumbsProps {
  crumbs: BreadCrumbsContextProps[];
}

export type IconNameI = keyof typeof ICONS;

const ICONS = {
  home: IconHome,
  concept: IconConcept,
  control: IconControl,
  employees: IconUsers,
  chart: IconChart,
};

const getIcon = (iconName: Nulleable<string>) => {
  if (!iconName || !ICONS) return null;

  if (iconName in ICONS) {
    return ICONS[iconName as IconNameI];
  }

  return null;
};

const BreadCrumbs = ({ crumbs }: BreadCrumbsProps) => {

  const breadcrumbs = useMemo(
    () =>
      crumbs.map(({ context: { crumb, iconName }, pathname }, i) => {
        const Icon = getIcon(iconName);
        return (
          <AppButtonLink
            to={pathname}
            key={crumb}
            variant={i === crumbs.length - 1 ? 'light' : 'subtle'}
            size="xs"
            radius="lg"
            leftSection={Icon ? <Icon /> : null}
            { ...linkDefaults } 
          >
            {crumb}
          </AppButtonLink>
        );
      }),
    []
  );

  return <BreadcrumbsMantine>{breadcrumbs}</BreadcrumbsMantine>;
};

export default BreadCrumbs;
