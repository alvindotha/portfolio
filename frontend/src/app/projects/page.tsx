'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Text, SimpleGrid, Center, Loader } from '@mantine/core';
import { ProjectCard } from '@/components/ProjectCard';
import { api } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then((res) => {
      if (res.data) setProjects(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Projects
      </Title>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : projects.length === 0 ? (
        <Text c="dimmed">No projects yet.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
