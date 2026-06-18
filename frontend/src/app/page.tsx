'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Text, Group, Badge, SimpleGrid, Card, Anchor, Paper, Loader, Center } from '@mantine/core';
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

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { staggerChildren: 0.06 },
};

const badgeItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getProjects().then((res) => {
      if (res.data) setProjects(res.data);
    });
  }, []);

  return (
    <Container size="lg" py="xl">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ padding: '4rem 0' }}
      >
        <Group align="center" gap="xl" wrap="nowrap">
          <ProfileImage />
          <div>
            <Title order={1} size="3.5rem" fw={700}>
              Hello, I&apos;m{' '}
              <Text component="span" inherit c="dimmed">
                lazy-tracker
              </Text>
            </Title>
            <Text size="xl" c="dimmed" mt="md" maw={600}>
              Developer &amp; problem solver. I build clean, functional web applications.
            </Text>
            <Group mt="lg">
              <Anchor
                component={Link}
                href="/blog"
                underline="never"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 20px',
                  borderRadius: 'var(--mantine-radius-md)',
                  border: '1px solid var(--mantine-color-dark-3)',
                  color: 'var(--mantine-color-dimmed)',
                  fontSize: 'var(--mantine-font-size-md)',
                  transition: 'border-color 0.2s, color 0.2s, gap 0.2s',
                }}
                className="hover:border-gray-400 hover:text-gray-300 hover:gap-3"
              >
                Read my blog
                <IconArrowRight size={16} style={{ transition: 'transform 0.2s' }} className="group-hover:translate-x-0.5" />
              </Anchor>
            </Group>
          </div>
        </Group>
      </motion.section>

      {/* About */}
      <motion.section {...fadeUp} style={{ padding: '3rem 0' }}>
        <Title order={2} mb="md">
          About
        </Title>
        <Text c="dimmed" maw={700}>
          I&apos;m a developer passionate about building clean, performant, and user-friendly
          applications. This is my space to share thoughts, projects, and experiments.
        </Text>
      </motion.section>

      {/* Skills */}
      <motion.section {...stagger} style={{ padding: '3rem 0' }}>
        <motion.div {...fadeUp}>
          <Title order={2} mb="md">
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
            <motion.span key={skill} variants={badgeItem} transition={{ duration: 0.4 }}>
              <Badge variant="light" size="lg">
                {skill}
              </Badge>
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* Projects */}
      <motion.section {...fadeUp} style={{ padding: '3rem 0' }}>
        <Group justify="space-between" mb="md">
          <Title order={2}>Projects</Title>
          <Anchor component={Link} href="/projects" size="sm" c="dimmed">
            View all &rarr;
          </Anchor>
        </Group>
        {projects.length === 0 ? (
          <Text c="dimmed">No projects yet.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {projects.slice(0, 3).map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card
                  withBorder
                  padding="lg"
                  style={{ height: '100%', cursor: 'pointer' }}
                  component={Link}
                  href={`/projects/${project.slug}`}
                >
                  <Text fw={600} mb="xs">
                    {project.title}
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
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
                </Card>
              </motion.div>
            ))}
          </SimpleGrid>
        )}
      </motion.section>

      {/* Contact */}
      <motion.section {...fadeUp} style={{ padding: '4rem 0' }}>
        <Paper withBorder p="xl" style={{ textAlign: 'center' }}>
          <IconMail size={32} style={{ opacity: 0.5, marginBottom: 12 }} />
          <Title order={2} mb="sm">
            Get in touch
          </Title>
          <Text c="dimmed" maw={400} mx="auto" mb="lg">
            Have a question or want to work together? Send me an email.
          </Text>
          <Anchor
            href="mailto:hello@lazy-tracker.my.id"
            size="lg"
            c="var(--mantine-color-text)"
            style={{
              fontWeight: 600,
              transition: 'opacity 0.2s',
            }}
            className="hover:opacity-60"
          >
            hello@lazy-tracker.my.id
          </Anchor>
        </Paper>
      </motion.section>
    </Container>
  );
}
