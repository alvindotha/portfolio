'use client';

import { Container, Text, Group } from '@mantine/core';
import { ContactLinks } from '@/components/ContactLinks';
import type { ContactLinks as ContactLinksData } from '@/lib/queries';

export function Footer({
  contact,
  appVersion,
}: {
  contact: ContactLinksData;
  appVersion: string;
}) {
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
            {appVersion && (
              <Text component="span" size="xs" c="dimmed" ml={4}>
                v{appVersion}
              </Text>
            )}
          </Text>
          <ContactLinks contact={contact} size={16} gap="sm" />
        </Group>
      </Container>
    </footer>
  );
}
