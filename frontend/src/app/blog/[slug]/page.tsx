import { notFound } from 'next/navigation';
import { Container, Title, Text, Group, Paper } from '@mantine/core';
import { getPost } from '@/lib/queries';
import { FadeIn } from '@/components/FadeIn';
import { PostReactions } from './PostReactions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found — Thalvindo' };
  return { title: `${post.title} — Thalvindo`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <Container size="md" py="xl">
      <FadeIn>
        <Title order={1} mb="xs">
          {post.title}
        </Title>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Group mb="lg" gap="sm">
          <Text size="sm" c="dimmed">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Group>

        <PostReactions
          slug={post.slug}
          initialLiked={post.hasLiked}
          initialLikeCount={post.likeCount}
          initialViewCount={post.viewCount}
          mt="md"
          mb="xl"
        />
      </FadeIn>

      <FadeIn delay={0.16}>
        <Paper
          className="tiptap-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          p={0}
          bg="transparent"
        />
      </FadeIn>

    </Container>
  );
}
