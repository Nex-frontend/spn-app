import { repository } from '~/server/repositories';
import { RefundUpdateNotesSchemaI } from '~/shared';

export const updateNotes = async (props: RefundUpdateNotesSchemaI) => {
  return await repository.spn.refunds.updateNotes(props);
};
