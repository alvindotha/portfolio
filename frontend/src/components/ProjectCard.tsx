'use client';

import { Card, Text, Group, Badge, Anchor } from '@mantine/core';
import { IconExternalLink, IconBrandGithub } from '@tabler/icons-react';
import Link from 'next/link';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  tech_stack: string[];
  project_url?: string;
  github_url?: string;
}

export function ProjectCard({ slug, title, description, tech_stack, project_url, github_url }: ProjectCardProps) {
  return (
    <Card
      withBorder
      padding="lg"
      style={{
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="hover:-translate-y-0.5 hover:shadow-lg"
    >
      <Anchor component={Link} href={`/projects/${slug}`} underline="never" c="inherit">
        <Text fw={600} size="lg" mb="xs">
          {title}
        </Text>
        <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ flex: 1 }}>
          {description}
        </Text>
      </Anchor>

      {tech_stack && tech_stack.length > 0 && (
        <Group gap={4} mb="md">
          {tech_stack.map((tech) => (
            <Badge key={tech} variant="light" size="sm">
              {tech}
            </Badge>
          ))}
        </Group>
      )}

      <Group gap="sm">
        <Anchor component={Link} href={`/projects/${slug}`} size="sm" c="dimmed">
          Details &rarr;
        </Anchor>
        {project_url && (
          <Anchor href={project_url} target="_blank" size="sm" c="dimmed">
            <IconExternalLink size={14} />
          </Anchor>
        )}
        {github_url && (
          <Anchor href={github_url} target="_blank" size="sm" c="dimmed">
            <IconBrandGithub size={14} />
          </Anchor>
        )}
      </Group>
    </Card>
  );
}
