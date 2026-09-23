'use client';

import { useState, useEffect } from 'react';
import { Group, ActionIcon, Container, Text, Anchor, Modal, Button } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const pathname = usePathname();
  const dark = colorScheme === 'dark';
  const [showModal, setShowModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(true);

  useEffect(() => {
    const val = localStorage.getItem('lightModeModalDismissed');
    setModalDismissed(val === 'true');
  }, []);

  const handleToggle = () => {
    if (dark && !modalDismissed) {
      setShowModal(true);
    } else {
      toggleColorScheme();
    }
  };

  const handleConfirmLight = () => {
    localStorage.setItem('lightModeModalDismissed', 'true');
    setModalDismissed(true);
    setShowModal(false);
    toggleColorScheme();
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/guestbook', label: 'Guestbook' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
        backgroundColor: 'light-dark(rgba(255,255,255,0.8), rgba(16,17,19,0.8))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Container size="lg" px="md">
        <Group justify="space-between" mih={56} wrap="wrap" gap="xs" py={6}>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Anchor component={Link} href="/" underline="never" c="inherit">
              <Text fw={700} size="lg">
                <Text component="span" variant="gradient" gradient={{ from: dark ? 'gray.3' : 'gray.7', to: dark ? 'gray.5' : 'gray.7' }} inherit>
                  Thalvindo
                </Text>
              </Text>
            </Anchor>
          </motion.div>

          <Group gap="lg" wrap="wrap" style={{ rowGap: 4 }}>
            {links.map((link, i) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Anchor
                    component={Link}
                    href={link.href}
                    size="sm"
                    style={{
                      color: isActive ? 'var(--mantine-color-text)' : 'var(--mantine-color-dimmed)',
                      fontWeight: isActive ? 500 : 400,
                      position: 'relative',
                      paddingBottom: 2,
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-gray-300"
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          left: 0,
                          right: 0,
                          height: 2,
                          borderRadius: 1,
                          background: 'var(--mantine-color-dark-3)',
                        }}
                      />
                    )}
                  </Anchor>
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ActionIcon variant="subtle" onClick={handleToggle} aria-label="Toggle theme">
                {dark ? <IconSun size={16} /> : <IconMoon size={16} />}
              </ActionIcon>
            </motion.div>
          </Group>
        </Group>
      </Container>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        withCloseButton={false}
        title="☀️ Light Mode"
        centered
        size="sm"
      >
        <Text ta="center" mb="lg" size="sm">
          Are you sure? Light attracts bugs.
        </Text>
        <Group justify="center">
          <Button onClick={handleConfirmLight}>
            Bring on the bugs
          </Button>
        </Group>
      </Modal>
    </header>
  );
}
