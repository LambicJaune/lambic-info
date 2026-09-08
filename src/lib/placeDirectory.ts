import { getPageBySlug, getPagesByType } from '@/lib/pages';
import type { Block, InlineContent, LinkMark, Page } from '@/types/blocks';

const PLACES_OVERVIEW_SLUG = 'list-of-lambic-bars-cafes-and-restaurants';

export interface PlaceCountry {
    name: string;
    slug: string;
    places: PlaceCard[];
}

export interface PlaceCard {
    page: Page;
    name: string;
    city: string | null;
}

export async function getPlaceCountries(): Promise<PlaceCountry[]> {
    const [overview, places] = await Promise.all([
        getPageBySlug(PLACES_OVERVIEW_SLUG, 'info-article'),
        getPagesByType('place'),
    ]);

    if (!overview) return [];
    const pagesBySlug = new Map(places.map((page) => [page.slug, page]));
    const countries: PlaceCountry[] = [];
    let current: PlaceCountry | null = null;

    for (const block of overview.blocks) {
        if (block.type === 'heading' && block.level === 2) {
            current = {
                name: inlineText(block.content),
                slug: block.anchor,
                places: [],
            };
            countries.push(current);
            continue;
        }

        if (!current || block.type !== 'list') continue;
        for (const item of block.items) {
            const link = item.content.find(isInternalLink);
            const slug = link?.href?.split('#')[0].split('/').filter(Boolean).at(-1);
            const page = slug ? pagesBySlug.get(slug) : null;
            if (!page || !link) continue;

            current.places.push({
                page,
                name: inlineText(link.content),
                city: cityFromAddress(page.address, current.name),
            });
        }
    }

    return countries.filter((country) => country.places.length > 0);
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

function cityFromAddress(address: string | null, country: string): string | null {
    if (!address) return null;
    const withoutCountry = address.replace(new RegExp(`,?\\s*${escapeRegex(country)}\\s*$`, 'i'), '');
    const postalThenCity = withoutCountry.match(/(?:B-)?\d{4,5}\s+([^,()]+)(?:\s*\([^)]*\))?\s*$/i);
    if (postalThenCity) return postalThenCity[1].trim();
    const cityThenPostal = withoutCountry.match(/(?:,|^)\s*([^,]+?)\s+\d{4,5}\s*$/i);
    if (cityThenPostal) return cityThenPostal[1].trim();

    const parts = withoutCountry.split(',').map((part) => part.trim()).filter(Boolean);
    if (/u\.s\.a\./i.test(country) && parts.length > 1) return parts[1];
    return parts.at(-1) ?? null;
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
