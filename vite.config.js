import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                background: "chrome-extension/background-script/index.ts",
                content: "chrome-extension/content-script/index.ts",
            },
            output: {
                dir: "chrome-extension/dist",
                format: "commonjs",
                entryFileNames: `[name].js`,
            },
        },
    },
    esbuild: {
        target: "es6",
    },
});
