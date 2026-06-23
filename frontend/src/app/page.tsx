'use client';

import { useEffect, useState } from 'react';
import {
  Container, Title, Text, Group, Badge, SimpleGrid, Anchor, Paper,
} from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconArrowRight, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { ProfileImage } from '@/components/ProfileImage';
import { api } from '@/lib/api';

const skills = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js',
  'Express', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Mantine UI',
  'Git', 'Linux',
];

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease },
};

const staggerParent = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { staggerChildren: 0.06 },
};

const badgeItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, ease },
};

const projectStagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { staggerChildren: 0.1 },
};

const projectItem = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease },
};

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
  const isLight = colorScheme === 'light';
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getProjects().then((res) => {
      if (res.data) setProjects(res.data.items);
    });
  }, []);

  return (
    <Container size="lg" py="xl">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        style={{ padding: '5rem 0' }}
      >
        <Group align="center" gap="xl" wrap="nowrap">
          <ProfileImage />
          <div>
            <Title order={1} size="3.5rem" fw={700} lh={1.15}>
              Hello, I&apos;m{' '}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: isLight ? 'gray.7' : 'gray.3', to: isLight ? 'gray.7' : 'gray.5' }}
              >
                Thalvindo
              </Text>
            </Title>
            <Text size="xl" c="dimmed" mt="md" maw={600} lh={1.6}>
              Developer &amp; problem solver. I build clean, functional web applications.
            </Text>
            <Group mt="lg">
              <motion.div
                whileHover={{ gap: 12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Anchor
                  component={Link}
                  href="/blog"
                  underline="never"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 24px',
                    borderRadius: 'var(--mantine-radius-md)',
                    border: '1px solid var(--mantine-color-dark-3)',
                    color: 'var(--mantine-color-dimmed)',
                    fontSize: 'var(--mantine-font-size-md)',
                    fontWeight: 500,
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  className="hover:border-gray-400 hover:text-gray-300"
                >
                  Read my blog
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <IconArrowRight size={16} />
                  </motion.span>
                </Anchor>
              </motion.div>
            </Group>
          </div>
        </Group>
      </motion.section>

      {/* About */}
      <motion.section {...fadeUp} style={{ padding: '4rem 0' }}>
        <Title order={2} mb="md" style={{ letterSpacing: '-0.02em' }}>
          About
        </Title>
        <Text c="dimmed" maw={700} size="lg" lh={1.7}>
          I&apos;m a developer passionate about building clean, performant, and user-friendly
          applications. This is my space to share thoughts, projects, and experiments.
        </Text>
      </motion.section>

      {/* Skills */}
      <motion.section {...staggerParent} style={{ padding: '4rem 0' }}>
        <motion.div {...fadeUp}>
          <Title order={2} mb="md" style={{ letterSpacing: '-0.02em' }}>
            Skills
          </Title>
        </motion.div>
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
        >
          {skills.map((skill) => (
            <motion.span key={skill} variants={badgeItem} whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <Badge variant="light" size="lg">
                {skill}
              </Badge>
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* Projects */}
      <motion.section {...fadeUp} style={{ padding: '4rem 0' }}>
        <Group justify="space-between" mb="md">
          <Title order={2} style={{ letterSpacing: '-0.02em' }}>Projects</Title>
          <Anchor component={Link} href="/projects" size="sm" c="dimmed">
            View all &rarr;
          </Anchor>
        </Group>
        {projects.length === 0 ? (
          <Text c="dimmed">No projects yet.</Text>
        ) : (
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            variants={projectStagger}
          >
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {projects.slice(0, 3).map((project) => (
                <motion.div
                  key={project.id}
                  variants={projectItem}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Anchor
                    component={Link}
                    href={`/projects/${project.slug}`}
                    underline="never"
                    style={{ display: 'block', height: '100%' }}
                  >
                    <Paper
                      withBorder
                      p="lg"
                      style={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                    >
                      <Text fw={600} mb="xs">
                        {project.title}
                      </Text>
                      <Text size="sm" c="dimmed" mb="md" lineClamp={3} lh={1.6}>
                        {project.description}
                      </Text>
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <Group gap={4}>
                          {project.tech_stack.slice(0, 3).map((tech: string) => (
                            <Badge key={tech} variant="light" size="sm">
                              {tech}
                            </Badge>
                          ))}
                        </Group>
                      )}
                    </Paper>
                  </Anchor>
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.div>
        )}
      </motion.section>

      {/* Contact */}
      <motion.section {...fadeUp} style={{ padding: '5rem 0' }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Paper withBorder p="xl" style={{ textAlign: 'center' }}>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <IconMail size={32} style={{ opacity: 0.5, marginBottom: 12 }} />
            </motion.div>
            <Title order={2} mb="sm" style={{ letterSpacing: '-0.02em' }}>
              Get in touch
            </Title>
            <Text c="dimmed" maw={400} mx="auto" mb="lg" size="lg">
              Have a question or want to work together? Send me an email.
            </Text>
            <Anchor
              href="mailto:hello@thalvindo.my.id"
              size="lg"
              c="var(--mantine-color-text)"
              style={{
                fontWeight: 600,
                transition: 'opacity 0.2s',
              }}
              className="hover:opacity-60"
            >
              hello@thalvindo.my.id
            </Anchor>
          </Paper>
        </motion.div>
      </motion.section>
    </Container>
  );
}
