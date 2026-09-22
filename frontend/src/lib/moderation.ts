import 'server-only';

// Matched against leetspeak-normalized text, so `sh1t` is caught too.
const blockedWordPatterns = [
  /\b(fuck|shit|asshole|bitch|bastard|dick|cock|cunt|whore|damn|slut|crap|piss|bollocks|wanker|twat|tosser|prick|douche|jackass|dumbass|moron)\b/i,
  /\b(nigger|faggot|retard|tranny|kike|spic|chink|gook)\b/i,
  // Adult-content spam, the most common junk a public guestbook attracts.
  /\b(porn|pornhub|xxx|sex|nude|nudes|naked|boobs|tits|penis|vagina|orgasm|masturbat\w*|escort|hentai|onlyfans|camgirl|milf|blowjob|handjob|anal|dildo|viagra|cialis|horny|nsfw)\b/i,
];

// Matched against the raw text — normalization strips the punctuation these need.
const linkPatterns = [
  /https?:\/\/\S+/i,
  /\bwww\.\S+/i,
  /\b[a-z0-9-]+\.(com|net|org|io|ru|xyz|top|cn|info|biz|link|click)\b/i,
];

const spamPatterns = [
  /(.)\1{10,}/,
  /[A-Z]{10,}/,
  /[\u{1F300}-\u{1F9FF}]{5,}/u,
  /\b(\w+)\s+\1\s+\1\b/i,
];

/** Undo common leetspeak substitutions so filters can't be trivially bypassed. */
function normalize(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i');
}

/** Returns an error message, or null when the text is acceptable. */
export function moderateContent(original: string): string | null {
  const normalized = normalize(original);

  if (blockedWordPatterns.some((p) => p.test(normalized))) {
    return 'Message contains inappropriate content';
  }

  if (linkPatterns.some((p) => p.test(original))) {
    return 'Links are not allowed';
  }

  if (spamPatterns.some((p) => p.test(original))) {
    return 'Message looks like spam';
  }

  return null;
}
