'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container, Title, TextInput, Textarea, Switch, Button, Group, Paper, Loader, Center,
} from '@mantine/core';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { token, loading: authLoading, isAuthenticated } = useRequireAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || authLoading || !id) return;

    api.getAdminPosts().then((res) => {
      if (res.data) {
        const post = res.data.find((p: any) => p.id === parseInt(id));
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setExcerpt(post.excerpt || '');
          setContent(post.content || '');
          setPublished(post.published);
        }
      }
      setLoading(false);
    });
  }, [isAuthenticated, authLoading, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await api.updatePost(parseInt(id), { title, slug, excerpt, content, published });
    if (res.data) {
      router.push('/admin/posts');
    }
    setSubmitting(false);
  };

  if (authLoading || loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Edit Post
      </Title>

      <form onSubmit={handleSubmit}>
        <Paper withBorder p="lg" mb="md">
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
            mb="sm"
          />
          <TextInput
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.currentTarget.value)}
            required
            mb="sm"
          />
          <Textarea
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.currentTarget.value)}
            maxLength={500}
            mb="sm"
          />
          <Switch
            label="Published"
            checked={published}
            onChange={(e) => setPublished(e.currentTarget.checked)}
          />
        </Paper>

        <Paper withBorder p="lg" mb="md">
          <RichTextEditor content={content} onChange={setContent} />
        </Paper>

        <Group>
          <Button type="submit" loading={submitting}>
            Save Changes
          </Button>
          <Button variant="subtle" onClick={() => router.push('/admin/posts')}>
            Cancel
          </Button>
        </Group>
      </form>
    </Container>
  );
}
