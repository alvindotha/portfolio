import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1a1b1e',
          950: '#101113',
        },
      },
    },
  },
  plugins: [],
};

export default config;
