import { IconGauge, IconNotes } from '@tabler/icons-react';
import { Route as ForteRoute } from '~/routes/_auth/(concepts)/forte';
import { Route as RefundRoute } from '~/routes/_auth/(concepts)/refund';
import { Route as DashboardRoute } from '~/routes/_auth/index';

export const getMenuLinks = () => [
  { label: 'Dashboard', icon: IconGauge, link: DashboardRoute.to },
  {
    label: 'Conceptos',
    icon: IconNotes,
    initiallyOpened: false,
    matchRoute: RefundRoute?.id?.replace(RefundRoute.path, '') ?? '',
    links: [
      { label: 'Reintegros', link: RefundRoute.to },
      { label: 'Forte', link: ForteRoute.to },
    ],
  },
];
