'use client';

import { useState } from 'react';
import { SimpleGrid, Center, Button, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { PostCard } from '@/components/PostCard';
import { fadeSlide, stagger } from '@/lib/animations';
import type { PostSummary } from '@/lib/queries';
import { loadMorePosts } from './actions';

export function PostList({
  initialPosts,
  initialHasMore,
}: {
  initialPosts: PostSummary[];
  initialHasMore: boolean;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const next = page + 1;
    const result = await loadMorePosts(next);
    setPosts((prev) => [...prev, ...result.items]);
    setPage(next);
    setHasMore(result.hasMore);
    setLoading(false);
  };

  return (
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
          <Button variant="subtle" onClick={loadMore} loading={loading}>
            Load More
          </Button>
        </Center>
      )}
    </Stack>
  );
}
