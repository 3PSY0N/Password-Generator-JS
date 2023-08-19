import {defineConfig} from 'vite';
import {viteStaticCopy} from 'vite-plugin-static-copy'
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    server: {
        https: true,
        host: true,
        port: 8080,
    },
    root: '.',
    build: {
        outDir: './docs'
    },
    plugins: [
        mkcert(),
        viteStaticCopy({
            targets: [
                {
                    src: './wordlist.txt',
                    dest: './'
                }
            ]
        })
    ]
})