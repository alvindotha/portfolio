'use client';

import { Card, Text, Group, Anchor } from '@mantine/core';
import { IconEye, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  created_at: string;
  like_count: string;
  view_count: string;
}

export function PostCard({ slug, title, excerpt, created_at, like_count, view_count }: PostCardProps) {
  return (
    <Anchor component={Link} href={`/blog/${slug}`} underline="never">
      <Card
        padding="lg"
        withBorder
        style={{
          transition: 'transform 0.15s, box-shadow 0.15s',
          cursor: 'pointer',
          height: '100%',
        }}
        className="hover:-translate-y-0.5 hover:shadow-lg"
      >
        <Text fw={600} size="lg" lineClamp={2} mb="xs">
          {title}
        </Text>
        {excerpt && (
          <Text size="sm" c="dimmed" lineClamp={3} mb="md">
            {excerpt}
          </Text>
        )}
        <Group justify="space-between" mt="auto">
          <Text size="xs" c="dimmed">
            {new Date(created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <Group gap="sm">
            <Group gap={4}>
              <IconEye size={14} />
              <Text size="xs">{view_count}</Text>
            </Group>
            <Group gap={4}>
              <IconHeart size={14} />
              <Text size="xs">{like_count}</Text>
            </Group>
          </Group>
        </Group>
      </Card>
    </Anchor>
  );
}
