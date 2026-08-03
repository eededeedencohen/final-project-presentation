import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import notesSyncPlugin from './tools/notes-sync-plugin.js'

export default defineConfig({
  plugins: [react(), notesSyncPlugin()],
  base: './',
  server: {
    watch: {
      /* סנכרון הפתקים כותב לכאן תוך כדי עבודה — בלי ההחרגה כל שמירה
         גוררת רענון-חם שמעלים את הפתק המוצג. קבצים חדשים ייכנסו
         ל-build הבא / אתחול השרת. מסנן-פונקציה — עמיד לנתיבי Windows */
      ignored: (p) => p.replace(/\\/g, '/').includes('/src/notes/'),
    },
  },
})
