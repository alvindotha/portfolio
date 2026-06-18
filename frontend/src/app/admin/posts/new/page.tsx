'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Title, TextInput, Textarea, Switch, Button, Group, Paper,
} from '@mantine/core';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth';

export default function NewPostPage() {
  const { token, loading: authLoading, isAuthenticated } = useRequireAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (authLoading || !isAuthenticated) return null;

  const generateSlug = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await api.createPost({ title, slug, excerpt, content, published });
    if (res.data) {
      router.push('/admin/posts');
    }
    setSubmitting(false);
  };

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        New Post
      </Title>

      <form onSubmit={handleSubmit}>
        <Paper withBorder p="lg" mb="md">
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => generateSlug(e.currentTarget.value)}
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
            Create Post
          </Button>
          <Button variant="subtle" onClick={() => router.push('/admin/posts')}>
            Cancel
          </Button>
        </Group>
      </form>
    </Container>
  );
}
