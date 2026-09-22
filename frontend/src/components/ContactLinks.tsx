'use client';

import { Group, Tooltip, Anchor } from '@mantine/core';
import {
  IconMail,
  IconPhone,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandYoutube,
} from '@tabler/icons-react';
import type { ContactLinks as ContactLinksData } from '@/lib/queries';

/** `tel:` only tolerates digits and a leading +, so strip the formatting. */
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/**
 * The channels worth showing, in display order. A channel whose `site_settings`
 * row is blank drops out here, so both the footer and the homepage hide it
 * without either of them knowing which channels exist.
 */
export function contactChannels(contact: ContactLinksData) {
  return [
    { key: 'email', label: 'Email', value: contact.email, href: `mailto:${contact.email}`, Icon: IconMail, external: false },
    { key: 'phone', label: 'Phone', value: contact.phone, href: telHref(contact.phone), Icon: IconPhone, external: false },
    { key: 'linkedin', label: 'LinkedIn', value: contact.linkedin, href: contact.linkedin, Icon: IconBrandLinkedin, external: true },
    { key: 'github', label: 'GitHub', value: contact.github, href: contact.github, Icon: IconBrandGithub, external: true },
    { key: 'gitlab', label: 'GitLab', value: contact.gitlab, href: contact.gitlab, Icon: IconBrandGitlab, external: true },
    { key: 'youtube', label: 'YouTube', value: contact.youtube, href: contact.youtube, Icon: IconBrandYoutube, external: true },
  ].filter((channel) => channel.value);
}

export function ContactLinks({
  contact,
  size = 18,
  gap = 'md',
  mt,
  omit = [],
}: {
  contact: ContactLinksData;
  size?: number;
  gap?: string;
  mt?: string;
  /** Channel keys already shown elsewhere in the same block, e.g. the homepage
   *  contact card spells the email out in full above these icons. */
  omit?: string[];
}) {
  const channels = contactChannels(contact).filter((c) => !omit.includes(c.key));

  if (channels.length === 0) return null;

  return (
    <Group gap={gap} justify="center" mt={mt}>
      {channels.map(({ key, label, href, Icon, external }) => (
        <Tooltip key={key} label={label} withArrow openDelay={300}>
          <Anchor
            href={href}
            aria-label={label}
            c="dimmed"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'color 0.2s, opacity 0.2s',
            }}
            className="hover:opacity-60"
          >
            <Icon size={size} stroke={1.5} />
          </Anchor>
        </Tooltip>
      ))}
    </Group>
  );
}
