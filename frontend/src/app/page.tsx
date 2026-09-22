import {
  getProjects,
  getPosts,
  getExperiences,
  getRecentGuestbookEntries,
  getContactLinks,
} from '@/lib/queries';
import { HomeContent } from './HomeContent';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [projects, posts, experiences, guestbookEntries, contact] = await Promise.all([
    getProjects(1),
    getPosts(1),
    getExperiences(),
    getRecentGuestbookEntries(3),
    getContactLinks(),
  ]);

  return (
    <HomeContent
      projects={projects.items.slice(0, 3)}
      posts={posts.items.slice(0, 3)}
      experiences={experiences}
      guestbookEntries={guestbookEntries}
      contact={contact}
    />
  );
}
