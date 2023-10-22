import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: 'src/background/index.ts',  // Entry point for background script
        content: 'src/content/index.ts',  // Entry point for content script
      },
      output: {
        dir: 'dist',
        format: 'commonjs',
        entryFileNames: `[name].js`,
      },
    },
  },
  esbuild: {
    target: 'es6',
  },
});
