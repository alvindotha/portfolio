import { Container, Title, Text } from '@mantine/core';
import { getProjects } from '@/lib/queries';
import { FadeIn } from '@/components/FadeIn';
import { ProjectList } from './ProjectList';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects — Thalvindo',
  description: 'Things I have designed, built, and shipped.',
};

export default async function ProjectsPage() {
  const { items, hasMore } = await getProjects(1);

  return (
    <Container size="lg" py="xl">
      <FadeIn>
        <Title order={1} mb="lg">
          Projects
        </Title>
      </FadeIn>

      {items.length === 0 ? (
        <Text c="dimmed">No projects yet.</Text>
      ) : (
        <ProjectList initialProjects={items} initialHasMore={hasMore} />
      )}
    </Container>
  );
}
