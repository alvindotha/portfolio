'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, Textarea, Button, Paper, Group, Stack, Text } from '@mantine/core';
import dynamic from 'next/dynamic';
import { signGuestbook } from './actions';

const Turnstile = dynamic(
  () => import('@marsidev/react-turnstile').then((m) => m.Turnstile),
  { ssr: false }
);

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function GuestbookForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    setError('');
    setSuccess(false);

    const result = await signGuestbook(name, message, turnstileToken);
    if (result.ok) {
      setMessage('');
      setTurnstileToken('');
      setTurnstileKey((k) => k + 1);
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  return (
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
          {siteKey && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Turnstile
                key={turnstileKey}
                siteKey={siteKey}
                onSuccess={(token) => setTurnstileToken(token)}
              />
            </div>
          )}
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {message.length}/2000
            </Text>
            <Button type="submit" loading={submitting} disabled={!!siteKey && !turnstileToken}>
              {success ? 'Sent!' : 'Send'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
