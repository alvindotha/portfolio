'use client';

import { useEffect, useState } from 'react';
import {
  Container, Title, Text, TextInput, Textarea, Button, Paper, Group, Stack, Loader, Center,
} from '@mantine/core';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

const Turnstile = dynamic(() => import('@marsidev/react-turnstile').then((m) => m.Turnstile), { ssr: false });
import { fadeSlide, stagger, fadeSlideTransition } from '@/lib/animations';

export default function GuestbookPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  const fetchEntries = () => {
    api.getGuestbook(1, 20).then((res) => {
      if (res.data) {
        setEntries(res.data.items);
        setHasMore(res.data.meta.page < res.data.meta.totalPages);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess(false);

    const res = await api.postGuestbook(name, message, turnstileToken);
    if (res.data) {
      setMessage('');
      setTurnstileToken('');
      setTurnstileKey((k) => k + 1);
      setSuccess(true);
      fetchEntries();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || 'Something went wrong');
    }
    setSubmitting(false);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await api.getGuestbook(nextPage, 20);
    const data = res.data;
    if (data) {
      setEntries((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setHasMore(nextPage < data.meta.totalPages);
    }
    setLoadingMore(false);
  };

  return (
    <Container size="md" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fadeSlideTransition}
      >
        <Title order={1} mb="xs">Guestbook</Title>
        <Text c="dimmed" mb="xl" size="lg">
          Leave a message — anything you&apos;d like to say.
        </Text>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...fadeSlideTransition, delay: 0.1 }}
      >
        <Paper withBorder p="lg" mb="xl">
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <TextInput
                label="Name (optional)"
                placeholder="Anonymous"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                maxLength={100}
              />
              <Textarea
                label="Message"
                placeholder="Write something..."
                required
                minRows={3}
                maxRows={6}
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                maxLength={2000}
                error={error}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Turnstile
                  key={turnstileKey}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(token) => setTurnstileToken(token)}
                />
              </div>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">{message.length}/2000</Text>
                <Button type="submit" loading={submitting} disabled={!turnstileToken}>
                  {success ? 'Sent!' : 'Send'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </motion.div>

      {/* Entries */}
      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : entries.length === 0 ? (
        <Paper withBorder p="xl" style={{ textAlign: 'center' }}>
          <Text c="dimmed">No messages yet. Be the first!</Text>
        </Paper>
      ) : (
        <Stack gap="xl">
          <motion.div initial="initial" animate="animate" variants={stagger}>
            <Stack gap="md">
              {entries.map((entry) => (
                <motion.div key={entry.id} variants={fadeSlide}>
                  <Paper withBorder p="md">
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" fw={500}>{entry.name}</Text>
                      <Text size="xs" c="dimmed">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
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
