'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'gray',
  primaryShade: { light: 6, dark: 5 },
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
    accent: [
      '#FFF8E7',
      '#FFEBB3',
      '#FFDE80',
      '#FFD04D',
      '#FFC31A',
      '#E6A900',
      '#B38500',
      '#806000',
      '#4D3B00',
      '#1A1300',
    ],
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  headings: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '600' },
  defaultRadius: 'md',
  autoContrast: true,
  luminanceThreshold: 0.4,
  components: {
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
      },
      styles: {
        root: {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        },
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      styles: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500,
        },
      },
    },
    Paper: {
      styles: {
        root: {
          borderColor: 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
        },
      },
    },
  },
});
