import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import InlineRenderer from '@/app/components/blocks/InlineRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
import type {
    Block,
    InlineContent,
    LinkMark,
    TableBlock,
    TableRow,
} from '@/types/blocks';
import { createHash } from 'node:crypto';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './ClosedProducersOverview.module.css';

export const dynamic = 'force-dynamic';

const OVERVIEW_SLUG = 'list-of-closed-lambic-breweries-and-blenders';

export default async function ClosedProducersOverview() {
    const page = await getPageBySlug(OVERVIEW_SLUG, 'info-article');
    if (!page) notFound();

    const content = adaptOverviewBlocks(page.blocks);

    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.main}>
                <div className={styles.pageTitleBanner}>
                    <h1>Closed Producers</h1>
                </div>

                <section className={styles.descriptionSection}>
                    <div className={styles.richText}>
                        <BlockRenderer blocks={content.introduction} />
                    </div>
                </section>

                <h2 className={styles.centeredTitle}>
                    Closed Lambic Brewers &amp; Blenders Pages
                </h2>

                <section className={styles.categoriesGrid}>
                    {content.cards.map((card) => (
                        <Link
                            key={card.slug}
                            href={`/closed-producers/${card.slug}`}
                            className={styles.categoryCard}
                        >
                            <div className={styles.categoryImageWrapper}>
                                <Image
                                    src="/images/shared/brewers_box.jpg"
                                    alt=""
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                />
                            </div>
                            <div className={styles.categoryOverlay}>
                                <h3>
                                    <span className={styles.cardName}>{card.title}</span>
                                    {card.location && (
                                        <span className={styles.cardLocation}>
                                            {card.location}
                                        </span>
                                    )}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </section>

                {content.directory && (
                    <DirectoryTable table={content.directory} />
                )}

                {content.trailing.length > 0 && (
                    <section className={styles.trailingContent}>
                        <BlockRenderer blocks={content.trailing} />
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}

interface OverviewCard {
    slug: string;
    title: string;
    location: string | null;
}

interface AdaptedOverview {
    introduction: Block[];
    cards: OverviewCard[];
    directory: TableBlock | null;
    trailing: Block[];
}

function adaptOverviewBlocks(blocks: Block[]): AdaptedOverview {
    const cardsHeadingIndex = blocks.findIndex(
        (block) =>
            block.type === 'heading' &&
            inlineText(block.content).includes('Closed Lambic Brewers & Blenders Pages')
    );
    const directoryHeadingIndex = blocks.findIndex(
        (block) =>
            block.type === 'heading' &&
            block.anchor === 'complete-list-of-closed-lambic-breweries-and-blenders'
    );
    const tableIndex = blocks.findIndex(
        (block, index) => index > directoryHeadingIndex && block.type === 'table'
    );

    const introductionEnd = cardsHeadingIndex === -1 ? directoryHeadingIndex : cardsHeadingIndex;
    const cardsStart = cardsHeadingIndex === -1 ? introductionEnd : cardsHeadingIndex + 1;
    const cardsEnd = directoryHeadingIndex === -1 ? blocks.length : directoryHeadingIndex;
    const directory = tableIndex === -1 || blocks[tableIndex].type !== 'table'
        ? null
        : blocks[tableIndex];

    return {
        introduction: blocks.slice(0, Math.max(introductionEnd, 0)),
        cards: extractCards(blocks.slice(cardsStart, cardsEnd)),
        directory,
        trailing: tableIndex === -1 ? [] : blocks.slice(tableIndex + 1),
    };
}

function extractCards(blocks: Block[]): OverviewCard[] {
    const cards = new Map<string, OverviewCard>();

    for (const block of blocks) {
        if (block.type !== 'paragraph') continue;
        for (const node of block.content) {
            if (!isInternalPageLink(node) || !node.href) continue;
            const slug = node.href.split('/').filter(Boolean).at(-1);
            if (!slug) continue;
            const label = splitCardLabel(
                decodeHtmlEntities(
                    safelyDecodeURIComponent(inlineText(node.content))
                )
            );
            cards.set(slug, {
                slug,
                title: label.title,
                location: label.location,
            });
        }
    }

    return [...cards.values()];
}

function splitCardLabel(label: string): {
    title: string;
    location: string | null;
} {
    const match = label.trim().match(/^(.*?)\s+(\([^()]+\))$/);
    return match
        ? { title: match[1], location: match[2] }
        : { title: label.trim(), location: null };
}

function isInternalPageLink(node: InlineContent[number]): node is LinkMark {
    return typeof node !== 'string' && node.type === 'link' && node.linkType === 'internal';
}

function DirectoryTable({ table }: { table: TableBlock }) {
    const [headerRow, ...bodyRows] = table.rows;
    const headers = headerRow?.cells.map((cell) => inlineText(cell.content)) ?? [];
    const groups = groupDirectoryRows(bodyRows, headers.length);

    return (
        <section className={styles.directorySection}>
            <h2 className={styles.centeredTitle}>
                Complete List of Closed Lambic Breweries and Blenders
            </h2>

            {groups.map((group) => (
                <details key={group.letter} className={styles.accordionDetails}>
                    <summary>{group.letter}</summary>
                    <div className={styles.tableWrapper}>
                        <table className={styles.logTable}>
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={`${header}-${index}`}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {group.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.cells.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                data-label={headers[cellIndex] ?? ''}
                                                colSpan={row.cells.length === 1 ? headers.length : cell.colspan ?? undefined}
                                                rowSpan={cell.rowspan ?? undefined}
                                            >
                                                <DirectoryCell content={cell.content} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            ))}
        </section>
    );
}

function DirectoryCell({ content }: { content: InlineContent }) {
    const extracted = extractEmbeddedGalleries(content);

    return (
        <>
            <InlineRenderer content={extracted.content} />
            {extracted.galleries.map((gallery, index) => (
                <div className={styles.directoryGallery} key={index}>
                    <BlockRenderer blocks={[gallery]} />
                </div>
            ))}
        </>
    );
}

function groupDirectoryRows(rows: TableRow[], columnCount: number) {
    const groups: { letter: string; rows: TableRow[] }[] = [];
    let current: { letter: string; rows: TableRow[] } | null = null;

    for (const row of rows) {
        const possibleLetter = row.cells.length === 1
            ? inlineText(row.cells[0].content).trim()
            : '';
        if (/^[A-Z]$/i.test(possibleLetter)) {
            current = { letter: possibleLetter.toUpperCase(), rows: [] };
            groups.push(current);
        } else if (current) {
            current.rows.push(normalizeDirectoryRow(row, columnCount));
        }
    }

    return groups;
}

function normalizeDirectoryRow(row: TableRow, columnCount: number): TableRow {
    if (row.cells.length !== 1 || !hasTableDelimiters(row.cells[0].content)) {
        return row;
    }

    const sourceCell = row.cells[0];
    const splitContent = splitInlineCells(sourceCell.content);
    if (splitContent.length <= 1) return row;

    while (splitContent.length < columnCount) splitContent.push([]);
    if (splitContent.length > columnCount) {
        splitContent[columnCount - 1].push(
            ' ',
            ...splitContent.splice(columnCount).flat()
        );
    }

    return {
        cells: splitContent.map((content) => ({
            isHeader: false,
            content,
            colspan: null,
            rowspan: null,
        })),
    };
}

function hasTableDelimiters(content: InlineContent): boolean {
    return content.some(
        (node) => typeof node === 'string' && node.includes('||')
    );
}

function splitInlineCells(content: InlineContent): InlineContent[] {
    const cells: InlineContent[] = [[]];

    for (const node of content) {
        if (typeof node !== 'string') {
            cells[cells.length - 1].push(node);
            continue;
        }

        const parts = node.split('||');
        parts.forEach((part, index) => {
            if (part) cells[cells.length - 1].push(part);
            if (index < parts.length - 1) cells.push([]);
        });
    }

    return cells;
}

function extractEmbeddedGalleries(content: InlineContent): {
    content: InlineContent;
    galleries: Extract<Block, { type: 'gallery' }>[];
} {
    const galleries: Extract<Block, { type: 'gallery' }>[] = [];
    const cleaned = content.flatMap((node): InlineContent => {
        if (typeof node !== 'string') return [node];

        const items: Extract<Block, { type: 'gallery' }>['items'] = [];
        const text = node.replace(
            /<gallery>([\s\S]*?)<\/gallery>/gi,
            (_match, body: string) => {
                for (const line of body.split(/\r?\n/)) {
                    const match = line.trim().match(/^File:([^|]+)(?:\|(.*))?$/i);
                    if (!match) continue;
                    const filename = canonicalFilename(match[1]);
                    const hash = createHash('md5').update(filename).digest('hex');
                    items.push({
                        url: `https://assets.lambic.info/images/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(filename)}`,
                        source: 'mediawiki-hashed',
                        caption: match[2] ? [match[2].trim()] : null,
                        alt: null,
                    });
                }
                return '';
            }
        );

        if (items.length > 0) {
            galleries.push({
                type: 'gallery',
                items,
                mode: null,
                heights: null,
                widths: null,
            });
        }

        return text ? [text] : [];
    });

    return { content: cleaned, galleries };
}

function canonicalFilename(filename: string): string {
    const normalized = filename.trim().replaceAll(' ', '_');
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function decodeHtmlEntities(value: string): string {
    return value.replace(
        /&(?:amp|lt|gt|quot|#39|#x27|#(\d+)|#x([\da-f]+));/gi,
        (entity, decimal: string | undefined, hexadecimal: string | undefined) => {
            const named: Record<string, string> = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'",
                '&#x27;': "'",
            };
            const normalized = entity.toLowerCase();
            if (named[normalized]) return named[normalized];
            if (decimal) return String.fromCodePoint(Number(decimal));
            if (hexadecimal) return String.fromCodePoint(parseInt(hexadecimal, 16));
            return entity;
        }
    );
}

function safelyDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function inlineText(content: InlineContent): string {
    return content
        .map((node) => {
            if (typeof node === 'string') return node;
            if (node.type === 'footnoteMarker') return '';
            return inlineText(node.content);
        })
        .join('');
}
