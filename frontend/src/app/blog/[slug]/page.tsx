'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container, Title, Text, Group, ActionIcon, Loader, Center, Paper,
} from '@mantine/core';
import { IconHeart, IconEye } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { fadeSlideUp, stagger, fadeSlideUpTransition } from '@/lib/animations';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getPost(slug).then((res) => {
      if (res.data) {
        setPost(res.data);
        setLikeCount(Number(res.data.like_count));
        setViewCount(Number(res.data.view_count));
        setLiked(res.data.has_liked);
      }
      setLoading(false);
    });
    api.viewPost(slug);
  }, [slug]);

  const handleLike = async () => {
    if (!slug || liking) return;
    setLiking(true);
    const res = await api.likePost(slug);
    if (res.data) {
      setLiked(res.data.liked);
      setLikeCount(Number(res.data.like_count));
    }
    setLiking(false);
  };

  if (loading) {
    return (
      <Center py="xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader />
        </motion.div>
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
      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        transition={{ staggerChildren: 0.12 }}
      >
        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
          <Title order={1} mb="xs">
            {post.title}
          </Title>
        </motion.div>

        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
          <Group mb="lg" gap="sm">
            <Text size="sm" c="dimmed">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </Text>
          </Group>
        </motion.div>

        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
          <Paper
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            p={0}
            bg="transparent"
          />
        </motion.div>

        <motion.div variants={fadeSlideUp} transition={fadeSlideUpTransition}>
          <Group mt="xl" gap="lg">
            <Group gap={4}>
              <IconEye size={16} />
              <Text size="sm" c="dimmed">{viewCount} views</Text>
            </Group>
            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Group gap={4}>
                <ActionIcon
                  variant={liked ? 'filled' : 'subtle'}
                  color={liked ? 'red' : 'gray'}
                  onClick={handleLike}
                  loading={liking}
                >
                  <motion.div
                    key={liked ? 'liked' : 'unliked'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    <IconHeart size={16} />
                  </motion.div>
                </ActionIcon>
                <Text size="sm">{likeCount}</Text>
              </Group>
            </motion.div>
          </Group>
        </motion.div>
      </motion.div>
    </Container>
  );
}
