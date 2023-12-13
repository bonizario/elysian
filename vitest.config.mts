import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      module: {
        type: 'es6',
      },
    }),
    tsconfigPaths(),
  ],
  test: {
    exclude: [...configDefaults.exclude, './data/pg/**'],
    globals: true,
    root: './',
  },
});
