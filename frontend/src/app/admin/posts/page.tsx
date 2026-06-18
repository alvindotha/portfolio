'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Title, Group, Button, Table, Badge, ActionIcon, Text, Loader, Center, Tabs,
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth';

export default function AdminPostsPage() {
  const { token, loading: authLoading, isAuthenticated } = useRequireAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    api.getAdminPosts().then((res) => {
      if (res.data) setPosts(res.data);
      setLoading(false);
    });
  }, [isAuthenticated, authLoading]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    const res = await api.deletePost(id);
    if (res.data) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
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
        <Button leftSection={<IconPlus size={16} />} onClick={() => router.push('/admin/posts/new')}>
          New Post
        </Button>
      </Group>

      <Tabs defaultValue="posts">
        <Tabs.List mb="md">
          <Tabs.Tab value="posts">Posts</Tabs.Tab>
          <Tabs.Tab value="projects" onClick={() => router.push('/admin/projects')}>Projects</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Views</Table.Th>
            <Table.Th>Likes</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {posts.map((post) => (
            <Table.Tr key={post.id}>
              <Table.Td>
                <Text fw={500}>{post.title}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={post.published ? 'green' : 'yellow'} variant="light">
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
              </Table.Td>
              <Table.Td>{post.view_count}</Table.Td>
              <Table.Td>{post.like_count}</Table.Td>
              <Table.Td>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(post.id)}>
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
