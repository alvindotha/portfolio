import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container, Title, Text, Group, Badge, Anchor, Paper } from '@mantine/core';
import { IconExternalLink, IconBrandGithub, IconArrowLeft } from '@tabler/icons-react';
import { getProject } from '@/lib/queries';
import { FadeIn } from '@/components/FadeIn';
import { ProjectReactions } from './ProjectReactions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project not found — Thalvindo' };
  return { title: `${project.title} — Thalvindo`, description: project.description };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <Container size="md" py="xl">
      <FadeIn>
        <Anchor
          component={Link}
          href="/projects"
          size="sm"
          c="dimmed"
          mb="lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          <IconArrowLeft size={14} />
          Back to projects
        </Anchor>
      </FadeIn>

      <FadeIn delay={0.06}>
        <Title order={1} mb="xs">
          {project.title}
        </Title>
      </FadeIn>

      {project.techStack.length > 0 && (
        <FadeIn delay={0.12}>
          <Group gap={4} mb="md">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="light" size="sm">
                {tech}
              </Badge>
            ))}
          </Group>
        </FadeIn>
      )}

      <FadeIn delay={0.18}>
        <Group gap="md" mb="lg">
          {project.projectUrl && (
            <Anchor href={project.projectUrl} target="_blank" rel="noopener noreferrer" size="sm">
              <Group gap={4}>
                <IconExternalLink size={14} />
                Live Demo
              </Group>
            </Anchor>
          )}
          {project.githubUrl && (
            <Anchor href={project.githubUrl} target="_blank" rel="noopener noreferrer" size="sm">
              <Group gap={4}>
                <IconBrandGithub size={14} />
                Source Code
              </Group>
            </Anchor>
          )}
        </Group>
      </FadeIn>

      <FadeIn delay={0.24}>
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
      </FadeIn>

      <FadeIn delay={0.3}>
        <ProjectReactions
          slug={project.slug}
          initialLiked={project.hasLiked}
          initialLikeCount={project.likeCount}
          initialViewCount={project.viewCount}
        />
      </FadeIn>
    </Container>
  );
}
