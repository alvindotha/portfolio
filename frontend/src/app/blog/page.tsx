'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Text, SimpleGrid, Center, Loader, Button, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { PostCard } from '@/components/PostCard';
import { api } from '@/lib/api';
import { fadeSlide, stagger, fadeSlideTransition } from '@/lib/animations';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    api.getPosts(1, 12).then((res) => {
      if (res.data) {
        setPosts(res.data.items);
        setHasMore(res.data.meta.page < res.data.meta.totalPages);
      }
      setLoading(false);
    });
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await api.getPosts(nextPage, 12);
    const data = res.data;
    if (data) {
      setPosts((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setHasMore(nextPage < data.meta.totalPages);
    }
    setLoadingMore(false);
  };

  return (
    <Container size="lg" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fadeSlideTransition}
      >
        <Title order={1} mb="lg">
          Blog
        </Title>
      </motion.div>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : posts.length === 0 ? (
        <Text c="dimmed">No posts yet. Check back soon!</Text>
      ) : (
        <Stack gap="xl">
          <motion.div initial="initial" animate="animate" variants={stagger}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {posts.map((post) => (
                <motion.div key={post.id} variants={fadeSlide}>
                  <PostCard {...post} />
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.div>
          {hasMore && (
            <Center>
              <Button variant="subtle" onClick={loadMore} loading={loadingMore}>
                Load More
              </Button>
            </Center>
          )}
        </Stack>
      )}
    </Container>
  );
}
