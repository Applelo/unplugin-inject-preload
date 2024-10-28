import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// import Inspect from 'vite-plugin-inspect'
import UnpluginInjectPreload from 'unplugin-inject-preload/vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        page: resolve(__dirname, 'page.html'),
        nested: resolve(__dirname, 'nested/index.html'),
        'sub-nested': resolve(__dirname, 'nested/sub-nested/index.html'),
      },
    },
  },
  plugins: [
    // Inspect(),
    UnpluginInjectPreload({
      files: [
        {
          outputMatch: /Roboto-[a-zA-Z]*-[a-zA-Z-0-9]*\.woff2$/,
        },
        {
          outputMatch: /lazy.[a-z-0-9]*.(css|js)$/,
        },
      ],
      injectTo: 'custom',
    }),
  ],
})
