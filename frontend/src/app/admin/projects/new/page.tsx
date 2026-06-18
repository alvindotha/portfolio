'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Title, TextInput, Textarea, Switch, Button, Group, Paper, NumberInput, TagsInput,
} from '@mantine/core';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth';

export default function NewProjectPage() {
  const { token, loading: authLoading, isAuthenticated } = useRequireAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<number>(0);
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
    const res = await api.createProject({
      title, slug, description, content, image_url: imageUrl,
      project_url: projectUrl, github_url: githubUrl,
      tech_stack: techStack, sort_order: sortOrder, published,
    });
    if (res.data) router.push('/admin/projects');
    setSubmitting(false);
  };

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">New Project</Title>
      <form onSubmit={handleSubmit}>
        <Paper withBorder p="lg" mb="md">
          <TextInput label="Title" value={title} onChange={(e) => generateSlug(e.currentTarget.value)} required mb="sm" />
          <TextInput label="Slug" value={slug} onChange={(e) => setSlug(e.currentTarget.value)} required mb="sm" />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} mb="sm" />
          <TextInput label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.currentTarget.value)} mb="sm" />
          <TextInput label="Project URL" value={projectUrl} onChange={(e) => setProjectUrl(e.currentTarget.value)} mb="sm" />
          <TextInput label="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.currentTarget.value)} mb="sm" />
          <TagsInput
            label="Tech Stack"
            value={techStack}
            onChange={setTechStack}
            placeholder="Type and enter to add"
            mb="sm"
          />
          <NumberInput label="Sort Order" value={sortOrder} onChange={(v) => setSortOrder(Number(v) || 0)} mb="sm" />
          <Switch label="Published" checked={published} onChange={(e) => setPublished(e.currentTarget.checked)} />
        </Paper>
        <Paper withBorder p="lg" mb="md">
          <RichTextEditor content={content} onChange={setContent} placeholder="Project details..." />
        </Paper>
        <Group>
          <Button type="submit" loading={submitting}>Create Project</Button>
          <Button variant="subtle" onClick={() => router.push('/admin/projects')}>Cancel</Button>
        </Group>
      </form>
    </Container>
  );
}
