import { UserConfig, ConfigEnv, loadEnv, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import VueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';
import eslintPlugin from 'vite-plugin-eslint';
import { visualizer } from 'rollup-plugin-visualizer';
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import';

// @see: https://gitee.com/holysheng/vite2-config-description/blob/master/vite.config.ts
export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      VueJsx(),
      eslintPlugin(),
      splitVendorChunkPlugin(),
      env.VITE_COMPRESSION !== 'false' &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz'
        }),
      env.VITE_REPORT && (visualizer() as any),
      createStyleImportPlugin({
        resolves: [VxeTableResolve()],
        libs: [
          {
            libraryName: 'element-plus',
            esModule: true,
            resolveStyle: (name: string) => {
              name = name.substring(3, name.length);
              return `element-plus/es/components/${name}/style/index`;
            }
          }
        ]
      })
    ],
    server: {
      host: 'localhost',
      port: Number(env.VITE_APP_PORT),
      open: true
    },

    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve('./src'), // @代替src
        '@public': path.resolve('./public') // @代替src
      }
    },
    build: {
      target: ['chrome64'],
      chunkSizeWarningLimit: 1500,
      minify: 'terser',
      // cssCodeSplit: false,
      terserOptions: {
        compress: {
          // warnings: false,
          drop_console: env.VITE_CONSOLE === '0' || false, //打包时删除console
          drop_debugger: true, //打包时删除 debugger
          pure_funcs: ['console.log']
        },
        output: {
          // 去掉注释内容
          comments: true
        }
      },
      rollupOptions: {
        external: ['xlsx', 'echarts'],
        output: {
          // Static resource classification and packaging
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            common: ['vue', 'vue-router', 'pinia', 'axios']
          },
          globals: {
            xlsx: 'xlsx',
            echarts: 'echarts'
          },
          paths: {
            echarts: 'https://mp-web.11h5.com/common/echarts@5.4.0.esm.min.js',
            xlsx: 'https://mp-web.11h5.com/common/xlsx@0.18.4.min.js'
          }
        }
      }
    }
  };
};
