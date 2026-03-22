import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const GITHUB_DEPLOYMENT_URL = 'https://jimmytobing.github.io/JimCapasitor/'

function githubDeploymentLinkPlugin() {
  return {
    name: 'github-deployment-link',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        console.log(`  ➜  GitHub:  ${GITHUB_DEPLOYMENT_URL}`)
      })
    },
  }
}

export default defineConfig({
  base: '/JimCapasitor/',
  plugins: [
    react(),
    githubDeploymentLinkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      includeAssets: ['favicon.png', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'WPA App',
        short_name: 'WPA',
        start_url: '/JimCapasitor/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
