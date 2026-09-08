import { getPageBySlug, getPagesByType } from '@/lib/pages';
import type { Block, InlineContent, LinkMark, Page } from '@/types/blocks';

const OVERVIEW_SLUG = 'list-of-experimental-lambic-breweries-and-blenders';

export interface ExperimentalDirectoryRow {
    name: string;
    slug: string | null;
    location: string;
    activeDates: string;
    overview: string;
}

export interface ExperimentalDirectory {
    pages: Page[];
    rows: ExperimentalDirectoryRow[];
    introduction: Block[];
}

export async function getExperimentalDirectory(): Promise<ExperimentalDirectory> {
    const [overview, infoPages] = await Promise.all([
        getPageBySlug(OVERVIEW_SLUG, 'info-article'),
        getPagesByType('info-article'),
    ]);
    if (!overview) return { pages: [], rows: [], introduction: [] };

    const pagesBySlug = new Map(infoPages.map(page => [page.slug, page]));
    const rows = extractDirectoryRows(overview, pagesBySlug);
    const pages = rows.flatMap(row => row.slug ? [pagesBySlug.get(row.slug)].filter((page): page is Page => Boolean(page)) : []);
    const firstTableIndex = overview.blocks.findIndex(block => block.type === 'table');
    const introduction = (firstTableIndex === -1 ? overview.blocks : overview.blocks.slice(0, firstTableIndex))
        .filter(block => block.type !== 'heading');
    return { pages: [...new Map(pages.map(page => [page.slug, page])).values()], rows, introduction };
}

export async function getExperimentalProducerPages(): Promise<Page[]> {
    return (await getExperimentalDirectory()).pages;
}

function extractDirectoryRows(overview: Page, pages: Map<string, Page>): ExperimentalDirectoryRow[] {
    const table = overview.blocks.find(block => block.type === 'table');
    if (!table || table.type !== 'table' || table.rows.length < 2) return [];
    const headers = table.rows[0].cells.map(cell => normalize(inlineText(cell.content)));
    return table.rows.slice(1).map(row => {
        const values = new Map(headers.map((header, index) => [header, row.cells[index]?.content ?? []]));
        const nameContent = findValue(values, 'name', 'producer', 'blendery', 'brewery');
        const linkedSlug = findInternalSlug(nameContent);
        const slug = linkedSlug && pages.has(linkedSlug) ? linkedSlug : null;
        return {
            name: inlineText(nameContent) || 'N/A',
            slug,
            location: inlineText(findValue(values, 'location', 'city', 'country')) || 'N/A',
            activeDates: inlineText(findValue(values, 'active dates', 'dates active', 'active')) || 'N/A',
            overview: inlineText(findValue(values, 'overview', 'notes', 'description')) || 'N/A',
        };
    }).filter(row => row.name !== 'N/A');
}

function findValue(values: Map<string, InlineContent>, ...names: string[]): InlineContent {
    for (const name of names) {
        const exact = values.get(name);
        if (exact) return exact;
        const partial = [...values.entries()].find(([header]) => header.includes(name));
        if (partial) return partial[1];
    }
    return [];
}

function findInternalSlug(content: InlineContent): string | null {
    const link = content.find(isInternalLink);
    return link?.href?.split('#')[0].split('/').filter(Boolean).at(-1) ?? null;
}

function inlineText(content: InlineContent): string {
    return content.map(node => typeof node === 'string' ? node : node.type === 'footnoteMarker' ? '' : inlineText(node.content)).join('').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function normalize(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isInternalLink(node: InlineContent[number]): node is LinkMark {
    return typeof node !== 'string' && node.type === 'link' && node.linkType === 'internal';
}
