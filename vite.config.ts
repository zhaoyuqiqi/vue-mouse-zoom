import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: './src',
      outDir: ['./dist/types'],
      //指定使用的tsconfig.json为我们整个项目根目录下,如果不配置,你也可以在components下新建tsconfig.json
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueMouseZoom',
      formats: ['cjs', 'es',],
      fileName: (format) => `${format}/vue-mouse-zoom.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue', // 全局变量名
        },
        exports: 'named',
      },
      plugins: [],
    },
  },
});
