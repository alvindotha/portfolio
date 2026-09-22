'use client';

import { Reactions } from '@/components/Reactions';
import { recordView, toggleLike } from './actions';

export function PostReactions(props: {
  slug: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialViewCount: number;
  mt?: string;
  mb?: string;
}) {
  return <Reactions {...props} noun="post" recordView={recordView} toggleLike={toggleLike} />;
}
