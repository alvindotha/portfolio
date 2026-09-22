import { Container, Title, Text } from '@mantine/core';
import { getGuestbookEntries } from '@/lib/queries';
import { FadeIn } from '@/components/FadeIn';
import { GuestbookForm } from './GuestbookForm';
import { GuestbookEntries } from './GuestbookEntries';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Guestbook — Thalvindo',
  description: 'Leave a message.',
};

export default async function GuestbookPage() {
  const { items, hasMore } = await getGuestbookEntries(1);

  return (
    <Container size="md" py="xl">
      <FadeIn>
        <Title order={1} mb="xs">
          Guestbook
        </Title>
        <Text c="dimmed" mb="xl" size="lg">
          Leave a message — anything you&apos;d like to say.
        </Text>
      </FadeIn>

      <FadeIn delay={0.1}>
        <GuestbookForm />
      </FadeIn>

      {/* Keyed on the newest entry: a fresh signature remounts the list so the
          new message appears at the top instead of below the loaded pages. */}
      <GuestbookEntries
        key={items[0]?.id ?? 'empty'}
        initialEntries={items}
        initialHasMore={hasMore}
      />
    </Container>
  );
}
