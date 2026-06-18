'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container, Title, Text, Group, ActionIcon, Loader, Center, Paper,
} from '@mantine/core';
import { IconHeart, IconEye } from '@tabler/icons-react';
import { api } from '@/lib/api';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState('0');
  const [viewCount, setViewCount] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getPost(slug).then((res) => {
      if (res.data) {
        setPost(res.data);
        setLikeCount(res.data.like_count);
        setViewCount(res.data.view_count);
        setLiked(res.data.has_liked);
      }
      setLoading(false);
    });
    api.viewPost(slug);
  }, [slug]);

  const handleLike = async () => {
    if (!slug) return;
    const res = await api.likePost(slug);
    if (res.data) {
      setLiked(res.data.liked);
      setLikeCount(res.data.like_count);
    }
  };

  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (!post) {
    return (
      <Container py="xl">
        <Text>Post not found.</Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xs">
        {post.title}
      </Title>
      <Group mb="lg" gap="sm">
        <Text size="sm" c="dimmed">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Text>
      </Group>

      <Paper
        className="tiptap-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
        p={0}
        bg="transparent"
      />

      <Group mt="xl" gap="lg">
        <Group gap={4}>
          <IconEye size={16} />
          <Text size="sm" c="dimmed">{viewCount} views</Text>
        </Group>
        <Group gap={4}>
          <ActionIcon
            variant={liked ? 'filled' : 'subtle'}
            color={liked ? 'red' : 'gray'}
            onClick={handleLike}
          >
            <IconHeart size={16} />
          </ActionIcon>
          <Text size="sm">{likeCount}</Text>
        </Group>
      </Group>
    </Container>
  );
}
