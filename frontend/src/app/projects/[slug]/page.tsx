'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container, Title, Text, Group, Badge, Anchor, Paper, Loader, Center,
} from '@mantine/core';
import { IconExternalLink, IconBrandGithub, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getProject(slug).then((res) => {
      if (res.data) setProject(res.data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (!project) {
    return (
      <Container py="xl">
        <Text>Project not found.</Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Anchor component={Link} href="/projects" size="sm" c="dimmed" mb="lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <IconArrowLeft size={14} />
        Back to projects
      </Anchor>

      <Title order={1} mb="xs">
        {project.title}
      </Title>

      {project.tech_stack && project.tech_stack.length > 0 && (
        <Group gap={4} mb="md">
          {project.tech_stack.map((tech: string) => (
            <Badge key={tech} variant="light" size="sm">
              {tech}
            </Badge>
          ))}
        </Group>
      )}

      <Group gap="md" mb="lg">
        {project.project_url && (
          <Anchor href={project.project_url} target="_blank" size="sm">
            <Group gap={4}>
              <IconExternalLink size={14} />
              Live Demo
            </Group>
          </Anchor>
        )}
        {project.github_url && (
          <Anchor href={project.github_url} target="_blank" size="sm">
            <Group gap={4}>
              <IconBrandGithub size={14} />
              Source Code
            </Group>
          </Anchor>
        )}
      </Group>

      {project.content ? (
        <Paper
          className="tiptap-content"
          dangerouslySetInnerHTML={{ __html: project.content }}
          p={0}
          bg="transparent"
        />
      ) : (
        <Text c="dimmed">{project.description}</Text>
      )}
    </Container>
  );
}
