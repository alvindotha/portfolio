'use client';

import { Container, Text, Group, Anchor } from '@mantine/core';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
        marginTop: 'auto',
      }}
    >
      <Container size="lg" px="md" py="lg">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            &copy; {new Date().getFullYear()} Thalvindo{' '}
            {process.env.NEXT_PUBLIC_APP_VERSION && (
              <Text component="span" size="xs" c="dimmed">
                v{process.env.NEXT_PUBLIC_APP_VERSION}
              </Text>
            )}
          </Text>
          <div />
        </Group>
      </Container>
    </footer>
  );
}
