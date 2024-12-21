import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate', // Atualiza automaticamente o SW
    manifest: {
      name: 'LaraTube',
      short_name: 'LaraTube',
      description: 'Videos selecionados cuidadosamente para você',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      icons: [
        {
          src: 'icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  })],
})
