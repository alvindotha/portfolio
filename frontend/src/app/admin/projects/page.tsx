'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Title, Group, Button, Table, Badge, ActionIcon, Text, Loader, Center, Tabs,
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth';

export default function AdminProjectsPage() {
  const { token, loading: authLoading, isAuthenticated } = useRequireAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    api.getAdminProjects().then((res) => {
      if (res.data) setProjects(res.data);
      setLoading(false);
    });
  }, [isAuthenticated, authLoading]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    const res = await api.deleteProject(id);
    if (res.data) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (authLoading || loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Admin</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => router.push('/admin/projects/new')}>
          New Project
        </Button>
      </Group>

      <Tabs defaultValue="projects">
        <Tabs.List mb="md">
          <Tabs.Tab value="posts" onClick={() => router.push('/admin/posts')}>
            Posts
          </Tabs.Tab>
          <Tabs.Tab value="projects">
            Projects
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Order</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects.map((project) => (
            <Table.Tr key={project.id}>
              <Table.Td>
                <Text fw={500}>{project.title}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={project.published ? 'green' : 'yellow'} variant="light">
                  {project.published ? 'Published' : 'Draft'}
                </Badge>
              </Table.Td>
              <Table.Td>{project.sort_order}</Table.Td>
              <Table.Td>
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => router.push(`/admin/projects/${project.id}/edit`)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(project.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
