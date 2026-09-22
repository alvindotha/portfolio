'use client';

import { Card, Text, Group, Anchor } from '@mantine/core';
import { IconEye, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
}

export function PostCard({ slug, title, excerpt, createdAt, likeCount, viewCount }: PostCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Anchor component={Link} href={`/blog/${slug}`} underline="never">
        <Card
          padding="lg"
          withBorder
          style={{
            cursor: 'pointer',
            height: '100%',
          }}
          className="hover:shadow-lg hover:border-gray-600"
        >
          <Text fw={600} size="lg" lineClamp={2} mb="xs">
            {title}
          </Text>
          {excerpt && (
            <Text size="sm" c="dimmed" lineClamp={3} mb="md" lh={1.6}>
              {excerpt}
            </Text>
          )}
          <Group justify="space-between" mt="auto">
            <Text size="xs" c="dimmed">
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <Group gap="sm">
              <Group gap={4}>
                <IconEye size={14} />
                <Text size="xs">{viewCount}</Text>
              </Group>
              <Group gap={4}>
                <IconHeart size={14} />
                <Text size="xs">{likeCount}</Text>
              </Group>
            </Group>
          </Group>
        </Card>
      </Anchor>
    </motion.div>
  );
}
