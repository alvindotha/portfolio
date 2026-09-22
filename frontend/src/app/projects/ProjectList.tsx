'use client';

import { useState } from 'react';
import { SimpleGrid, Center, Button, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { fadeSlide, stagger } from '@/lib/animations';
import type { ProjectSummary } from '@/lib/queries';
import { loadMoreProjects } from './actions';

export function ProjectList({
  initialProjects,
  initialHasMore,
}: {
  initialProjects: ProjectSummary[];
  initialHasMore: boolean;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const next = page + 1;
    const result = await loadMoreProjects(next);
    setProjects((prev) => [...prev, ...result.items]);
    setPage(next);
    setHasMore(result.hasMore);
    setLoading(false);
  };

  return (
    <Stack gap="xl">
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {projects.map((project) => (
            <motion.div key={project.id} variants={fadeSlide}>
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </SimpleGrid>
      </motion.div>
      {hasMore && (
        <Center>
          <Button variant="subtle" onClick={loadMore} loading={loading}>
            Load More
          </Button>
        </Center>
      )}
    </Stack>
  );
}
