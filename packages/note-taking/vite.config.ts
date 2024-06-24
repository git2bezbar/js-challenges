/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		TanStackRouterVite(),
	],
	define: {
		'import.meta.vitest': 'undefined',
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: './tests/setup.ts',
	},
	server: {
		port: 4001,
	},
});
