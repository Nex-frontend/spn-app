import { IconGauge, IconNotes, IconServer, IconUsers } from '@tabler/icons-react';
import { Route as ForteRoute } from '~/routes/_auth/(concepts)/forte';
import { Route as RefundRoute } from '~/routes/_auth/(concepts)/refund';
import { Route as DashboardRoute } from '~/routes/_auth';
import { Route as EmployeesRoute } from '~/routes/_auth/(kardex)/employees';
import { Route as controlCoverRoute } from '~/routes/_auth/(siapsep)/controlCover';
import { Route as captureRoute } from '~/routes/_auth/(siapsep)/capture';

export const getMenuLinks = () => [
  { label: 'Dashboard', icon: IconGauge, link: DashboardRoute.to },
    {
    label: 'SIAPSEP',
    icon: IconServer,
    initiallyOpened: false,
    matchRoute: controlCoverRoute?.id?.replace(controlCoverRoute.path, '') ?? '',
    links: [
      { label: 'Control de caratulas', link: controlCoverRoute.to },
      { label: 'Captura', link: captureRoute.to },
    ],
  },
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
  {
    label: 'Kardex',
    icon: IconUsers,
    initiallyOpened: false,
    matchRoute: EmployeesRoute?.id?.replace(EmployeesRoute.path, '') ?? '',
    links: [
      { label: 'Empleados', link: EmployeesRoute.to },
    ],
  },

];
