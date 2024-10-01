import fs from 'fs';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const { peerDependencies, devDependencies } = packageJson;
const external = [
  ...Object.keys(peerDependencies),
  ...Object.keys(devDependencies),
];

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      overlay: false,
    }),
    tsconfigPaths(),
    dts({ include: 'src', exclude: 'src/examples' }),
  ],
  build: {
    minify: false,
    lib: {
      entry: 'src/index.ts',
      fileName: (format: string) => {
        return `${format}/index.js`;
      },
      formats: ['es'],
    },
    rollupOptions: {
      external,
    },
  },
});
