'use client';

import { Card, Text, Group, Badge, Anchor } from '@mantine/core';
import { IconExternalLink, IconBrandGithub, IconEye, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  likeCount: number;
  viewCount: number;
  projectUrl?: string;
  githubUrl?: string;
}

export function ProjectCard({
  slug,
  title,
  description,
  techStack,
  projectUrl,
  githubUrl,
  likeCount,
  viewCount,
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ height: '100%' }}
    >
      <Card
        withBorder
        padding="lg"
        style={{
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="hover:shadow-lg hover:border-gray-600"
      >
        <Anchor component={Link} href={`/projects/${slug}`} underline="never" c="inherit">
          <Text fw={600} size="lg" mb="xs">
            {title}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={3} mb="md" lh={1.6} style={{ flex: 1 }}>
            {description}
          </Text>
        </Anchor>

        {techStack.length > 0 && (
          <Group gap={4} mb="md">
            {techStack.map((tech) => (
              <Badge key={tech} variant="light" size="sm">
                {tech}
              </Badge>
            ))}
          </Group>
        )}

        <Group gap="sm" justify="space-between">
          <Group gap="sm">
            <Anchor component={Link} href={`/projects/${slug}`} size="sm" c="dimmed">
              Details &rarr;
            </Anchor>
            {projectUrl && (
              <Anchor href={projectUrl} target="_blank" rel="noopener noreferrer" size="sm" c="dimmed">
                <IconExternalLink size={14} />
              </Anchor>
            )}
            {githubUrl && (
              <Anchor href={githubUrl} target="_blank" rel="noopener noreferrer" size="sm" c="dimmed">
                <IconBrandGithub size={14} />
              </Anchor>
            )}
          </Group>

          {/* Same pair, same order as PostCard, so a card reads the same way
              whichever listing you are on. */}
          <Group gap="sm" c="dimmed">
            <Group gap={4}>
              <IconEye size={14} />
              <Text size="xs">{viewCount}</Text>
            </Group>
            <Group gap={4}>
              <IconHeart size={14} />
              <Text size="xs">{likeCount}</Text>
            </Group>
          </Group>
        </Group>
      </Card>
    </motion.div>
  );
}
