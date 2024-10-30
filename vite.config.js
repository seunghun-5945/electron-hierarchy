import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  base: './',
  optimizeDeps: {
    include: [
      'ace-builds/src-min-noconflict/ace',
      'ace-builds/src-min-noconflict/theme-monokai',
      'ace-builds/src-min-noconflict/mode-javascript',
      'ace-builds/src-min-noconflict/mode-html',
      'ace-builds/src-min-noconflict/mode-css',
      'ace-builds/src-min-noconflict/mode-python',
      'ace-builds/src-min-noconflict/mode-java',
      'ace-builds/src-min-noconflict/mode-text'
    ]
  }
});