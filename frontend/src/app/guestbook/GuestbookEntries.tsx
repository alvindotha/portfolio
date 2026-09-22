'use client';

import { useState } from 'react';
import { Paper, Text, Group, Stack, Center, Button } from '@mantine/core';
import { motion } from 'framer-motion';
import { fadeSlide, stagger } from '@/lib/animations';
import type { GuestbookEntry } from '@/lib/queries';
import { loadMoreGuestbookEntries } from './actions';

export function GuestbookEntries({
  initialEntries,
  initialHasMore,
}: {
  initialEntries: GuestbookEntry[];
  initialHasMore: boolean;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const next = page + 1;
    const result = await loadMoreGuestbookEntries(next);
    setEntries((prev) => [...prev, ...result.items]);
    setPage(next);
    setHasMore(result.hasMore);
    setLoading(false);
  };

  if (entries.length === 0) {
    return (
      <Paper withBorder p="xl" style={{ textAlign: 'center' }}>
        <Text c="dimmed">No messages yet. Be the first!</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="xl">
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <Stack gap="md">
          {entries.map((entry) => (
            <motion.div key={entry.id} variants={fadeSlide}>
              <Paper withBorder p="md">
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>
                    {entry.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(entry.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                  {entry.message}
                </Text>
              </Paper>
            </motion.div>
          ))}
        </Stack>
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
