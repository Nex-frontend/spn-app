import { createServerFn } from '@tanstack/react-start';
import { controlProcess } from '../index';

export const getFortnight = createServerFn().handler(async () => {
  return await controlProcess.cases.getSiapsepInitialData();
});
