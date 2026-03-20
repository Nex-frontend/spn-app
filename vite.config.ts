
// // import { defineConfig } from '@tanstack/react-start/config';

// export default defineConfig({
//   // server: {
//   //   preset: 'node-server',
//   // preset: 'cloudflare-pages',
//   // unenv: cloudflare,
//   // },
//   tsr: {
//     appDirectory: 'src',
//   },
//   vite: {
//     plugins: [
//       tsConfigPaths({
//         projects: ['./tsconfig.json'],
//       }),
//       tailwindcss(),
//     ],
//     resolve: {
//       alias: {
//         // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
//         '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
//       },
//     },
//   },
// });

import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tanstackStart(),
    tailwindcss(),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
});
