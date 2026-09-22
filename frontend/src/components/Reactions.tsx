'use client';

import { useEffect, useState } from 'react';
import { Group, Text, ActionIcon } from '@mantine/core';
import { IconHeart, IconEye } from '@tabler/icons-react';
import { motion } from 'framer-motion';

/**
 * Views and likes for anything that has them. Posts and projects share one
 * likes table and one views table, so they share this component too; each
 * passes its own server actions rather than the component knowing which kind
 * of thing it is counting.
 */
export function Reactions({
  slug,
  noun,
  initialLiked,
  initialLikeCount,
  initialViewCount,
  recordView,
  toggleLike,
}: {
  slug: string;
  noun: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialViewCount: number;
  recordView: (slug: string) => Promise<number | null>;
  toggleLike: (slug: string) => Promise<{ liked: boolean; likeCount: number } | null>;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    recordView(slug).then((count) => {
      if (count !== null) setViewCount(count);
    });
  }, [slug, recordView]);

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
          {viewCount} {viewCount === 1 ? 'view' : 'views'}
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
            aria-label={liked ? `Unlike this ${noun}` : `Like this ${noun}`}
          >
            <IconHeart size={16} fill={liked ? 'currentColor' : 'none'} />
          </ActionIcon>
          <Text size="sm" c="dimmed">
            {likeCount}
          </Text>
        </Group>
      </motion.div>
    </Group>
  );
}
