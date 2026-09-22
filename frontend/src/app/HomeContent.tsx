'use client';

import {
  Container, Title, Text, Group, Badge, SimpleGrid, Anchor, Paper, Stack,
} from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { motion, type Variants } from 'framer-motion';
import { IconArrowRight, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { ProfileImage } from '@/components/ProfileImage';
import type {
  ProjectSummary,
  PostSummary,
  ExperienceEntry,
  GuestbookEntry,
  ContactLinks as ContactLinksData,
} from '@/lib/queries';
import { formatDateRange } from '@/lib/dates';
import { PostCard } from '@/components/PostCard';
import { ContactLinks } from '@/components/ContactLinks';

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease },
};

const arrowNudge: Variants = {
  rest: {
    x: [0, 4, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  hover: {
    x: 6,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
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

export function HomeContent({
  projects,
  posts,
  experiences,
  guestbookEntries,
  contact,
}: {
  projects: ProjectSummary[];
  posts: PostSummary[];
  experiences: ExperienceEntry[];
  guestbookEntries: GuestbookEntry[];
  contact: ContactLinksData;
}) {
  const { colorScheme } = useMantineColorScheme();
  const isLight = colorScheme === 'light';

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
                Alvindo Tehmono
              </Text>
            </Title>
            <Text size="xl" c="dimmed" mt="md" maw={600} lh={1.6}>
              Developer &amp; problem solver. I build functional applications &mdash; and run them myself, on a home server in the next room.
            </Text>
            <Group mt="lg">
              <motion.div
                initial="rest"
                animate="rest"
                whileHover="hover"
                style={{ display: 'inline-block' }}
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
                    lineHeight: 1,
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  className="hover:border-gray-400 hover:text-gray-300"
                >
                  <span>See my blogs</span>
                  {/* inline-flex, not inline: transforms don't apply to inline
                      elements, and it drops the SVG's baseline descender gap. */}
                  <motion.span
                    variants={arrowNudge}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <IconArrowRight size={16} />
                  </motion.span>
                </Anchor>
              </motion.div>
            </Group>
          </div>
        </Group>
      </motion.section>

      {/* Experience — hidden until there are rows to show */}
      {experiences.length > 0 && (
        <motion.section {...fadeUp} style={{ padding: '4rem 0' }}>
          <Title order={2} mb="lg" style={{ letterSpacing: '-0.02em' }}>
            Experience
          </Title>
          <Stack gap={0}>
            {experiences.map((job, i) => (
              <div
                key={job.id}
                style={{
                  display: 'flex',
                  gap: 20,
                  paddingBottom: i === experiences.length - 1 ? 0 : '2rem',
                }}
              >
                {/* Timeline rail: a dot per role, joined by a line except on the last */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    paddingTop: 6,
                  }}
                  aria-hidden
                >
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: job.endDate
                        ? 'light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-3))'
                        : 'var(--mantine-color-teal-5)',
                    }}
                  />
                  {i < experiences.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 24,
                        marginTop: 6,
                        background:
                          'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <Group gap={8} align="baseline" wrap="wrap">
                    <Text fw={600}>{job.role}</Text>
                    <Text c="dimmed">·</Text>
                    {job.url ? (
                      <Anchor
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        c="dimmed"
                        fw={500}
                      >
                        {job.company}
                      </Anchor>
                    ) : (
                      <Text c="dimmed" fw={500}>
                        {job.company}
                      </Text>
                    )}
                  </Group>
                  <Group gap={8} mt={2}>
                    <Text size="sm" c="dimmed">
                      {formatDateRange(job.startDate, job.endDate)}
                    </Text>
                    {job.location && (
                      <>
                        <Text size="sm" c="dimmed">
                          ·
                        </Text>
                        <Text size="sm" c="dimmed">
                          {job.location}
                        </Text>
                      </>
                    )}
                  </Group>
                  {job.description && (
                    <Text c="dimmed" mt="xs" lh={1.7} style={{ whiteSpace: 'pre-wrap' }}>
                      {job.description}
                    </Text>
                  )}
                </div>
              </div>
            ))}
          </Stack>
        </motion.section>
      )}

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
              {projects.map((project) => (
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
                      {project.techStack.length > 0 && (
                        <Group gap={4}>
                          {project.techStack.slice(0, 3).map((tech) => (
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

      {/* Latest posts */}
      {posts.length > 0 && (
        <motion.section {...fadeUp} style={{ padding: '4rem 0' }}>
          <Group justify="space-between" mb="md">
            <Title order={2} style={{ letterSpacing: '-0.02em' }}>
              Writing
            </Title>
            <Anchor component={Link} href="/blog" size="sm" c="dimmed">
              View all &rarr;
            </Anchor>
          </Group>
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            variants={projectStagger}
          >
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {posts.map((post) => (
                <motion.div key={post.id} variants={projectItem}>
                  <PostCard {...post} />
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.div>
        </motion.section>
      )}

      {/* Guestbook teaser */}
      {guestbookEntries.length > 0 && (
        <motion.section {...fadeUp} style={{ padding: '4rem 0' }}>
          <Group justify="space-between" mb="md">
            <Title order={2} style={{ letterSpacing: '-0.02em' }}>
              Guestbook
            </Title>
            <Anchor component={Link} href="/guestbook" size="sm" c="dimmed">
              Sign it &rarr;
            </Anchor>
          </Group>
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-80px' }}
            variants={projectStagger}
          >
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {guestbookEntries.map((entry) => (
                <motion.div key={entry.id} variants={projectItem}>
                  <Paper withBorder p="md" style={{ height: '100%' }}>
                    <Text size="sm" lh={1.6} lineClamp={4} style={{ whiteSpace: 'pre-wrap' }}>
                      {entry.message}
                    </Text>
                    <Text size="xs" c="dimmed" mt="sm">
                      — {entry.name}
                    </Text>
                  </Paper>
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.div>
        </motion.section>
      )}

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
              href={`mailto:${contact.email}`}
              size="lg"
              c="var(--mantine-color-text)"
              style={{
                fontWeight: 600,
                transition: 'opacity 0.2s',
              }}
              className="hover:opacity-60"
            >
              {contact.email}
            </Anchor>
            {/* Everything else I'm reachable on; the email is already spelled
                out above, and blank settings rows drop out on their own. */}
            <ContactLinks contact={contact} size={20} gap="lg" mt="lg" omit={['email']} />
          </Paper>
        </motion.div>
      </motion.section>
    </Container>
  );
}
