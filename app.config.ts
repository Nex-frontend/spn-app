import { defineConfig } from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // server: {
  //   preset: 'node-server',
  // preset: 'cloudflare-pages',
  // unenv: cloudflare,
  // },
  tsr: {
    appDirectory: 'src',
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
});
