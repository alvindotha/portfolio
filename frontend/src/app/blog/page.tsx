'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Text, SimpleGrid, Center, Loader } from '@mantine/core';
import { PostCard } from '@/components/PostCard';
import { api } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPosts().then((res) => {
      if (res.data) setPosts(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Blog
      </Title>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : posts.length === 0 ? (
        <Text c="dimmed">No posts yet. Check back soon!</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
