import { createServerFn } from '@tanstack/react-start';
import { getLastFortnight } from '~/server/useCases/siapsep/controlProcessFortnight/getLastFortnight.case';

export const getFornight = createServerFn().handler(async () => {
  const data = await getLastFortnight();
  return data[0].qna_proc;
});
