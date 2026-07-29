/**
 * src/utils/text.ts
 * -------------------
 * Small text-formatting helpers shared between the Articles.astro teaser
 * and the /articles listing/detail pages, so date formatting and excerpt
 * generation stay in one place instead of being copy-pasted per component.
 */

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

/** Strip HTML tags from a rendered post body and truncate for a card excerpt. */
export function excerptFrom(html: string | undefined, maxLength = 150): string {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
