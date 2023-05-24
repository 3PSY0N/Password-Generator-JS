import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  server: {
    https: true,
    host: true,
	port: 8080,
  },
  plugins: [ mkcert() ]
})