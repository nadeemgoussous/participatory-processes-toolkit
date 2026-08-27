import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the build works from GitHub Pages, from a plain static
  // server, and from a folder opened directly off a USB drive.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-*.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Participatory Processes Toolkit',
        short_name: 'Participation',
        description: 'A digital edition of the IRENA toolkit Participatory processes for strategic energy planning.',
        theme_color: '#0078a7',
        background_color: '#0078a7',
        display: 'standalone',
        start_url: '/stakeholder-dialogue/',
        scope: '/stakeholder-dialogue/',
        orientation: 'any',
        categories: ['education', 'utilities'],
        icons: [
          {
            src: '/stakeholder-dialogue/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/stakeholder-dialogue/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/stakeholder-dialogue/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/stakeholder-dialogue/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Cache all static assets for offline use
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,xlsx}'],
        // Set max size for model files (default is 2MB which is too small)
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024 * 1024, // 3GB for large models
        // Runtime caching for API calls and model files
        runtimeCaching: [
          // WebLLM Model Files - Cache-First for large model downloads
          {
            urlPattern: /^https:\/\/huggingface\.co\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'webllm-models',
              expiration: {
                maxEntries: 20, // Multiple model files
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              // Range requests support for large files
              rangeRequests: true,
            }
          },
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/mlc-ai\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'webllm-models',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              rangeRequests: true,
            }
          },
          // Ollama API - Network-First (local server, always try network)
          {
            urlPattern: /^http:\/\/localhost:11434\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ollama-api',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Cloud API fallback - Network-First
          {
            urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
