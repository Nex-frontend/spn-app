import { repository } from '~/server/repositories';
import { SearchSchemaI } from '~/shared';

export const getLogs = async (props: SearchSchemaI) => {
  return await repository.spn.refunds.getLogs({ ...props });
};
