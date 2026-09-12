import { getPageBySlug, getPagesByType } from '@/lib/pages';
import type { InlineContent, LinkMark, Page } from '@/types/blocks';

const EVENTS_OVERVIEW_SLUG = 'list-of-lambic-events';

export interface EventCountry {
    name: string;
    slug: string;
    events: EventCard[];
}

export interface EventCard {
    page: Page;
    name: string;
}

export async function getEventCountries(): Promise<EventCountry[]> {
    const [overview, events] = await Promise.all([
        getPageBySlug(EVENTS_OVERVIEW_SLUG, 'info-article'),
        getPagesByType('event'),
    ]);
    if (!overview) return [];

    const pagesBySlug = new Map(events.map((page) => [page.slug, page]));
    const linkedSlugs = eventLinkSlugs(overview);
    const missingPages = await Promise.all(
        linkedSlugs.filter((slug) => !pagesBySlug.has(slug)).map((slug) => getPageBySlug(slug)),
    );
    for (const page of missingPages) {
        if (page) pagesBySlug.set(page.slug, page);
    }

    const countries: EventCountry[] = [];
    let current: EventCountry | null = null;

    for (const block of overview.blocks) {
        if (block.type === 'heading' && block.level === 2) {
            current = { name: inlineText(block.content), slug: block.anchor, events: [] };
            countries.push(current);
            continue;
        }
        if (!current || block.type !== 'list') continue;

        for (const item of block.items) {
            const link = item.content.find(isInternalLink);
            const slug = link?.href.split('#')[0].split('/').filter(Boolean).at(-1);
            const page = slug ? pagesBySlug.get(slug) : null;
            if (page && link) current.events.push({ page, name: inlineText(link.content) });
        }
    }

    return countries
        .filter((country) => country.events.length > 0)
        .sort((a, b) => {
            if (a.slug === 'worldwide') return -1;
            if (b.slug === 'worldwide') return 1;
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        });
}

function eventLinkSlugs(page: Page): string[] {
    const slugs = page.blocks.flatMap((block) => {
        if (block.type !== 'list') return [];
        return block.items.flatMap((item) => {
            const link = item.content.find(isInternalLink);
            const slug = link?.href.split('#')[0].split('/').filter(Boolean).at(-1);
            return slug ? [slug] : [];
        });
    });
    return [...new Set(slugs)];
}

function isInternalLink(node: InlineContent[number]): node is LinkMark {
    return typeof node !== 'string' && node.type === 'link' && node.linkType === 'internal';
}

function inlineText(content: InlineContent): string {
    return content.map((node) => {
        if (typeof node === 'string') return node;
        if (node.type === 'footnoteMarker') return '';
        return inlineText(node.content);
    }).join('').trim();
}
