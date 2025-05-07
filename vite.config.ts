import type { UserConfig } from 'vite'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

export default defineConfig(async () => {
  const config: UserConfig = {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
  return config
})
