import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +  // Removed duplicate accounts.google.com, as it's not typically needed for styles
        "img-src 'self' data: https://showposters.blob.core.windows.net/poster/Movie%20Posters/; " +  // Correctly added your image source
        "frame-ancestors 'none'; " +
        "font-src 'self' https://fonts.gstatic.com data:; " +  // Use HTTPS for fonts.gstatic.com
        "connect-src 'self' https://localhost:5000 https://accounts.google.com https://oauth2.googleapis.com; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-src https://accounts.google.com https://oauth2.googleapis.com;"  // Removed 'self' if not needed for framing
    }
    ,

    cors: {
      origin: 'http://localhost:3000',
      credentials: true, // ✅ Allow cookies for authentication
    },
  },
});
