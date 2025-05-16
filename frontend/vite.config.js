import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite'

export default defineConfig({
    plugins: [tailwind(),react()],
    server: {
        port: 5173
    }
});