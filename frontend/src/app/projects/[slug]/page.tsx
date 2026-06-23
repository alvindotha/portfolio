'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container, Title, Text, Group, Badge, Anchor, Paper, Loader, Center,
} from '@mantine/core';
import { IconExternalLink, IconBrandGithub, IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import { fadeSlideUp, stagger, fadeSlideUpTransition } from '@/lib/animations';

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader />
        </motion.div>
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
      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
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
        </motion.div>

        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
          <Title order={1} mb="xs">
            {project.title}
          </Title>
        </motion.div>

        {project.tech_stack && project.tech_stack.length > 0 && (
          <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
            <Group gap={4} mb="md">
              {project.tech_stack.map((tech: string) => (
                <Badge key={tech} variant="light" size="sm">
                  {tech}
                </Badge>
              ))}
            </Group>
          </motion.div>
        )}

        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
          <Group gap="md" mb="lg">
            {project.project_url && (
              <Anchor href={project.project_url} target="_blank" rel="noopener noreferrer" size="sm">
                <Group gap={4}>
                  <IconExternalLink size={14} />
                  Live Demo
                </Group>
              </Anchor>
            )}
            {project.github_url && (
              <Anchor href={project.github_url} target="_blank" rel="noopener noreferrer" size="sm">
                <Group gap={4}>
                  <IconBrandGithub size={14} />
                  Source Code
                </Group>
              </Anchor>
            )}
          </Group>
        </motion.div>

        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
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
        </motion.div>
      </motion.div>
    </Container>
  );
}
