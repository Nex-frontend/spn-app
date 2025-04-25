import { useMemo } from 'react';
import { Breadcrumbs as BreadcrumbsMantine } from '@mantine/core';
import { AppButtonLink } from '../AppLink';
import { IconConcept, IconHome } from '../Icons';
import { Nulleable } from '~/utils';

interface BreadCrumbsContextProps {
  context: { crumb?: string | null; iconName?: string | null };
  pathname: string;
}

interface BreadCrumbsProps {
  crumbs: BreadCrumbsContextProps[];
}

export type IconNameI = keyof typeof ICONS;

const ICONS = {
  home: IconHome,
  concept: IconConcept,
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
      crumbs.map(({ context: { crumb, iconName }, pathname }) => {
        const Icon = getIcon(iconName);
        return (
          <AppButtonLink
            to={pathname}
            key={crumb}
            variant="subtle"
            size="xs"
            radius="lg"
            leftSection={Icon ? <Icon size={14} /> : null}
            // disabled={i === crumbs.length - 1}
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
