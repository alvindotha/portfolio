'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container, Title, TextInput, Textarea, Switch, Button, Group, Paper, NumberInput, TagsInput, Loader, Center,
} from '@mantine/core';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || authLoading || !id) return;
    api.getAdminProjects().then((res) => {
      if (res.data) {
        const project = res.data.find((p: any) => p.id === parseInt(id));
        if (project) {
          setTitle(project.title);
          setSlug(project.slug);
          setDescription(project.description || '');
          setContent(project.content || '');
          setImageUrl(project.image_url || '');
          setProjectUrl(project.project_url || '');
          setGithubUrl(project.github_url || '');
          setTechStack(project.tech_stack || []);
          setSortOrder(project.sort_order || 0);
          setPublished(project.published);
        }
      }
      setLoading(false);
    });
  }, [isAuthenticated, authLoading, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await api.updateProject(parseInt(id), {
      title, slug, description, content, image_url: imageUrl,
      project_url: projectUrl, github_url: githubUrl,
      tech_stack: techStack, sort_order: sortOrder, published,
    });
    if (res.data) router.push('/admin/projects');
    setSubmitting(false);
  };

  if (authLoading || loading) {
    return <Center py="xl"><Loader /></Center>;
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">Edit Project</Title>
      <form onSubmit={handleSubmit}>
        <Paper withBorder p="lg" mb="md">
          <TextInput label="Title" value={title} onChange={(e) => setTitle(e.currentTarget.value)} required mb="sm" />
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
          <Button type="submit" loading={submitting}>Save Changes</Button>
          <Button variant="subtle" onClick={() => router.push('/admin/projects')}>Cancel</Button>
        </Group>
      </form>
    </Container>
  );
}
