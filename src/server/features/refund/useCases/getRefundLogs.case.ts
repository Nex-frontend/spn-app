import { repository } from '~/server/repositories';

type FilterI = {
  id: string;
  value: unknown;
}[];

type FilterFnI = {
  [x: string]: string;
};

interface Props {
  limit: number;
  page: number;
  orderBy: string;
  order: 'asc' | 'desc';
  filters: FilterI;
  filtersFn: FilterFnI;
}

export const getLogs = async (props: Props) => {
  return await repository.spn.refunds.getRefundLogs({ ...props });
};
