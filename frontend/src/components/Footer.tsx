'use client';

import { Container, Text, Group, Anchor } from '@mantine/core';

export function Footer() {
  const year = new Date().getFullYear();

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
            &copy; {year} Thalvindo
            {process.env.NEXT_PUBLIC_APP_VERSION && (
              <Text component="span" size="xs" c="dimmed" ml={4}>
                v{process.env.NEXT_PUBLIC_APP_VERSION}
              </Text>
            )}
          </Text>
          <Group gap="md">
            <Anchor href="mailto:hello@thalvindo.my.id" size="sm" c="dimmed">
              Email
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
