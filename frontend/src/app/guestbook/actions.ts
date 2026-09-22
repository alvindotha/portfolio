'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getClientIp } from '@/lib/ip';
import { moderateContent } from '@/lib/moderation';
import { verifyTurnstile } from '@/lib/turnstile';
import { getGuestbookEntries, type GuestbookEntry } from '@/lib/queries';

const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 3;

export type SignResult =
  | { ok: true; entry: GuestbookEntry }
  | { ok: false; error: string };

export async function signGuestbook(
  name: string,
  message: string,
  turnstileToken: string
): Promise<SignResult> {
  const trimmed = message.trim();

  if (trimmed.length === 0) return { ok: false, error: 'Message is required' };
  if (trimmed.length < MIN_MESSAGE_LENGTH) return { ok: false, error: 'Message is too short' };
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` };
  }

  const ipAddress = getClientIp();

  if (!(await verifyTurnstile(turnstileToken, ipAddress))) {
    return { ok: false, error: 'Verification failed' };
  }

  const messageError = moderateContent(trimmed);
  if (messageError) return { ok: false, error: messageError };

  const displayName = name.trim().slice(0, 100) || 'Anonymous';
  if (displayName !== 'Anonymous' && moderateContent(displayName)) {
    return { ok: false, error: 'Name contains inappropriate content' };
  }

  const created = await prisma.guestbookEntry.create({
    data: { name: displayName, message: trimmed, ipAddress },
    select: { id: true, name: true, message: true, createdAt: true },
  });

  revalidatePath('/guestbook');

  return {
    ok: true,
    entry: { ...created, createdAt: created.createdAt.toISOString() },
  };
}

export async function loadMoreGuestbookEntries(page: number) {
  return getGuestbookEntries(page);
}
