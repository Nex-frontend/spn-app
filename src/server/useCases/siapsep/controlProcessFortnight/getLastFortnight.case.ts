import { getCurrentFortnight } from '~/server/features/controlProcessFortnight/respository/controlProcess.repository';

export const getLastFortnight = async () => {
  try {
    return await getCurrentFortnight();
  } catch (error) {
    console.log({ error });
    return [{ qna_proc: 0 }];
  }
};
