'use client';

import { useEffect, useState } from 'react';
import { Group, Text, ActionIcon } from '@mantine/core';
import { IconHeart, IconEye } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { recordView, toggleLike } from './actions';

export function PostReactions({
  slug,
  initialLiked,
  initialLikeCount,
  initialViewCount,
}: {
  slug: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialViewCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    recordView(slug).then((count) => {
      if (count !== null) setViewCount(count);
    });
  }, [slug]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    const result = await toggleLike(slug);
    if (result) {
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    }
    setLiking(false);
  };

  return (
    <Group mt="xl" gap="lg">
      <Group gap={4}>
        <IconEye size={16} />
        <Text size="sm" c="dimmed">
          {viewCount} views
        </Text>
      </Group>
      <motion.div
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Group gap={4}>
          <ActionIcon
            variant={liked ? 'filled' : 'subtle'}
            color={liked ? 'red' : 'gray'}
            onClick={handleLike}
            loading={liking}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
          >
            <motion.div
              key={liked ? 'liked' : 'unliked'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <IconHeart size={16} />
            </motion.div>
          </ActionIcon>
          <Text size="sm">{likeCount}</Text>
        </Group>
      </motion.div>
    </Group>
  );
}
