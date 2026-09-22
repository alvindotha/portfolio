import { Container, Title, Text } from '@mantine/core';
import { getPosts } from '@/lib/queries';
import { FadeIn } from '@/components/FadeIn';
import { PostList } from './PostList';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog — Thalvindo',
  description: 'Posts about web development, infrastructure, and things I build.',
};

export default async function BlogPage() {
  const { items, hasMore } = await getPosts(1);

  return (
    <Container size="lg" py="xl">
      <FadeIn>
        <Title order={1} mb="lg">
          Blog
        </Title>
      </FadeIn>

      {items.length === 0 ? (
        <Text c="dimmed">No posts yet. Check back soon!</Text>
      ) : (
        <PostList initialPosts={items} initialHasMore={hasMore} />
      )}
    </Container>
  );
}
