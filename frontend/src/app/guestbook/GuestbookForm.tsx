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

/**
 * The site key arrives as a prop, read by the server page at request time.
 * Reading process.env here instead would inline it at BUILD time, so the
 * container image would need rebuilding to add or rotate a key — and setting
 * only the secret would leave the server demanding a token the browser never
 * renders a widget to produce, rejecting every signature.
 */
export function GuestbookForm({ siteKey }: { siteKey?: string }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  // Turnstile is only a gate when a site key is configured; with no key the
  // widget never renders and the button must stay usable.
  const awaitingCheck = !!siteKey && !turnstileToken;

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
          <Group justify="space-between" align="center">
            <Text size="xs" c="dimmed">
              {/* Say why the button is inert, rather than leaving it to be guessed. */}
              {awaitingCheck ? 'Complete the check above to send' : `${message.length}/2000`}
            </Text>
            <Button
              type="submit"
              loading={submitting}
              disabled={awaitingCheck}
              // The theme's primaryColor is gray at shade 5 (#adb5bd), so a
              // filled Button comes out near-white — which reads as disabled
              // rather than as the primary action. The accent palette exists in
              // the theme for exactly this, so the live button looks live.
              color="accent"
              styles={{
                root: {
                  // The theme's primary colour is a pale grey, so a normal
                  // enabled button already looks washed out — close enough to
                  // Mantine's disabled styling that the two were hard to tell
                  // apart once the Turnstile gate was added. Make the inert
                  // state unmistakably inert.
                  opacity: awaitingCheck ? 0.35 : 1,
                  cursor: awaitingCheck ? 'not-allowed' : undefined,
                },
              }}
            >
              {success ? 'Sent!' : 'Send'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
