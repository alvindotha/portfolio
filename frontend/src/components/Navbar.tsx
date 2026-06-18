'use client';

import { Group, ActionIcon, Container, Text, Anchor } from '@mantine/core';
import { IconSun, IconMoon, IconEdit } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';

export function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
        backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))',
      }}
    >
      <Container size="lg" px="md">
        <Group justify="space-between" h={56}>
          <Anchor component={Link} href="/" underline="never" c="inherit">
            <Text fw={700} size="lg">
              lazy-tracker
            </Text>
          </Anchor>

          <Group gap="sm">
            <Anchor component={Link} href="/blog" size="sm" c="dimmed">
              Blog
            </Anchor>
            <Anchor component={Link} href="/projects" size="sm" c="dimmed">
              Projects
            </Anchor>
            {process.env.NEXT_PUBLIC_APP_ENV !== 'production' && (
              <Anchor component={Link} href="/admin/projects" size="sm" c="dimmed">
                <IconEdit size={16} />
              </Anchor>
            )}
            <ActionIcon variant="subtle" onClick={toggleColorScheme} aria-label="Toggle theme">
              {dark ? <IconSun size={16} /> : <IconMoon size={16} />}
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </header>
  );
}
