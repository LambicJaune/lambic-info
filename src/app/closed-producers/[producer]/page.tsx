import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import InlineRenderer from '@/app/components/blocks/InlineRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import BeerPortfolio from './BeerPortfolio';
import type { BeerPortfolioItem } from './BeerPortfolio';
import { getPageBySlug } from '@/lib/pages';
import type { Block, ImageRef, InlineContent, ListItem, Page } from '@/types/blocks';
import { createHash } from 'node:crypto';
import { notFound } from 'next/navigation';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import styles from './ClosedProducerPage.module.css';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ producer: string }>;
}

// Temporary compatibility for the still-mocked overview. These legacy card
// slugs can disappear when that route starts querying the pages table.
const closedProducerSlugAliases: Record<string, string> = {
    ankerhof: 'brasserie-ankerhof',
    'baeten-l': 'brasserie-l-baeten',
    belgor: 'brasserie-belgor',
    brabrux: 'brasserie-brabrux',
    couronne: 'brasserie-de-la-couronne',
    'cretens-maeck': 'brasserie-cretens-maeck',
    'de-boeck': 'brasserie-de-boeck',
    'de-coster-louis-emile': 'brasserie-louis-emile-de-coster',
    'de-neve': 'brasserie-de-neve',
    espagne: 'brasserie-espagne',
    eylenbosch: 'eylenbosch-huizingen',
    goossens: 'brasserie-goossens',
    winderickx: 'brouwerij-winderickx',
};

// These pages belong to the closed-producer collection but are temporarily
// misclassified in the migrated pages table.
const legacyInfoArticleProducers = new Set([
    'brouwerij-wets',
    'brouwerij-willems',
]);

export default async function ClosedProducerPage({ params }: Props) {
    const { producer } = await params;
    const routeSlug = producer.toLowerCase();
    const slug = closedProducerSlugAliases[routeSlug] ?? routeSlug;
    let page = await getPageBySlug(slug, 'closed-producer');

    if (!page && legacyInfoArticleProducers.has(slug)) {
        page = await getPageBySlug(slug, 'info-article');
    }

    if (!page) {
        notFound();
    }

    const displayTitle = page.displayTitle ?? page.title.replaceAll('_', ' ');
    const prepared = prepareClosedProducer(page);

    return (
        <>
            <GenericBanner backLink="/closed-producers" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1 className={styles.noTransform}>{displayTitle}</h1>
                </section>

                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.infoBar}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>
                                    <FaMapMarkerAlt /> Location
                                </span>
                                <span className={styles.metaValue}>
                                    {page.address ?? 'N/A'}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Active Dates</span>
                                <span className={styles.metaValue}>N/A</span>
                            </div>
                            {page.phone && (
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>
                                        <FaPhone /> Phone
                                    </span>
                                    <span className={styles.metaValue}>{page.phone}</span>
                                </div>
                            )}
                        </div>

                        <article className={styles.historySection}>
                            {prepared.hero ? (
                                <div
                                    className={styles.floatingImageWrapper}
                                    style={{
                                        width: getHeroDisplayWidth(prepared.hero),
                                    }}
                                >
                                    {/* Native images support the migrated remote
                                        asset hosts without Next image-host config. */}
                                    <img
                                        src={prepared.hero.url}
                                        alt={prepared.hero.alt ?? displayTitle}
                                        width={prepared.hero.width ?? undefined}
                                        className={styles.historicalImage}
                                    />
                                    {prepared.heroCaption && (
                                        <p className={styles.imageCaption}>
                                            <InlineRenderer content={prepared.heroCaption} />
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className={`${styles.floatingImageWrapper} ${styles.heroPlaceholder}`}>
                                    <span>{displayTitle}</span>
                                </div>
                            )}

                            <div className={styles.blockContent}>
                                <ClosedProducerBlocks blocks={prepared.beforeBeers} />
                                {prepared.beers && (
                                    <BeerPortfolio
                                        introduction={prepared.beers.introduction}
                                        items={prepared.beers.items}
                                    />
                                )}
                                <ClosedProducerBlocks blocks={prepared.afterBeers} />
                            </div>
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

/**
 * The migrated page begins with its old wiki back-link and may repeat the
 * promoted logo as a body image. The shell renders both elsewhere, so remove
 * only those matching pre-heading blocks and leave the authored body intact.
 */
interface PreparedClosedProducer {
    hero: ImageRef | null;
    heroCaption: InlineContent | null;
    beforeBeers: Block[];
    afterBeers: Block[];
    beers: { introduction: Block[]; items: BeerPortfolioItem[] } | null;
}

function ClosedProducerBlocks({ blocks }: { blocks: Block[] }) {
    const brewerianaIndex = blocks.findIndex(
        (block) => block.type === 'heading' && block.anchor === 'breweriana'
    );
    if (brewerianaIndex !== -1) {
        const nextPrimarySectionOffset = blocks
            .slice(brewerianaIndex + 1)
            .findIndex(
                (block) =>
                    isReferencesHeading(block) ||
                    (block.type === 'heading' &&
                        /^(?:photos?|gallery)$/.test(block.anchor))
            );
        const brewerianaEnd = nextPrimarySectionOffset === -1
            ? blocks.length
            : brewerianaIndex + 1 + nextPrimarySectionOffset;

        return (
            <>
                <ClosedProducerBlocks blocks={blocks.slice(0, brewerianaIndex)} />
                <section className={styles.brewerianaSection}>
                    <BlockRenderer blocks={blocks.slice(brewerianaIndex, brewerianaEnd)} />
                </section>
                <ClosedProducerBlocks blocks={blocks.slice(brewerianaEnd)} />
            </>
        );
    }

    const referencesIndex = blocks.findIndex(
        (block) => isReferencesHeading(block)
    );
    if (referencesIndex === -1) return <BlockRenderer blocks={blocks} />;

    const heading = blocks[referencesIndex];
    const nextHeadingOffset = blocks.slice(referencesIndex + 1).findIndex(
        (block) =>
            block.type === 'heading' &&
            heading.type === 'heading' &&
            block.level <= heading.level
    );
    const referencesEnd = nextHeadingOffset === -1
        ? blocks.length
        : referencesIndex + 1 + nextHeadingOffset;

    return (
        <>
            <BlockRenderer blocks={blocks.slice(0, referencesIndex)} />
            <section className={styles.referencesSection}>
                <BlockRenderer blocks={blocks.slice(referencesIndex, referencesEnd)} />
            </section>
            <ClosedProducerBlocks blocks={blocks.slice(referencesEnd)} />
        </>
    );
}

function isReferencesHeading(block: Block): boolean {
    return (
        block.type === 'heading' &&
        (/references?|sources?/i.test(block.anchor) ||
            /references?|sources?/i.test(inlineText(block.content)))
    );
}

function prepareClosedProducer(page: Page): PreparedClosedProducer {
    const firstHeadingIndex = page.blocks.findIndex(
        (block) => block.type === 'heading'
    );
    const preambleEnd =
        firstHeadingIndex === -1 ? page.blocks.length : firstHeadingIndex;

    let blocks = page.blocks.filter((block, index) => {
        if (index >= preambleEnd) return true;

        if (block.type === 'image' && block.url === page.logo?.url) {
            return false;
        }

        return !isBackLinkParagraph(block, page);
    });

    const legacyImage = extractLegacyLeadImage(blocks);
    if (legacyImage) blocks = legacyImage.blocks;
    const linkedImage = extractLinkedLeadImage(blocks);
    if (linkedImage) blocks = linkedImage.blocks;
    const leadImage = extractLeadBlockImages(blocks);
    blocks = leadImage.blocks;
    blocks = convertLegacyGalleryParagraphs(blocks);
    blocks = removeInvalidGalleryItems(blocks);
    const hero =
        page.logo ?? legacyImage?.image ?? linkedImage?.image ?? leadImage.image;
    const heroCaption = page.logo?.caption
        ? [page.logo.caption]
        : legacyImage?.caption ?? linkedImage?.caption ?? leadImage.caption;

    const beersIndex = blocks.findIndex(
        (block) => block.type === 'heading' && block.anchor === 'beers'
    );
    if (beersIndex === -1) {
        return {
            hero,
            heroCaption,
            beforeBeers: blocks,
            afterBeers: [],
            beers: null,
        };
    }

    const nextHeadingOffset = blocks.slice(beersIndex + 1).findIndex(
        (block) => block.type === 'heading' && block.level === 2
    );
    const beersEnd = nextHeadingOffset === -1
        ? blocks.length
        : beersIndex + 1 + nextHeadingOffset;
    const beerBody = blocks.slice(beersIndex + 1, beersEnd);
    const items = extractPortfolioItems(beerBody);

    if (items.length === 0) {
        return {
            hero,
            heroCaption,
            beforeBeers: blocks,
            afterBeers: [],
            beers: null,
        };
    }

    return {
        hero,
        heroCaption,
        beforeBeers: blocks.slice(0, beersIndex),
        afterBeers: blocks.slice(beersEnd),
        beers: {
            introduction: beerBody.filter(
                (block) =>
                    block.type !== 'list' &&
                    !(block.type === 'heading' && block.level > 2)
            ),
            items,
        },
    };
}

function cleanBeerItem(item: ListItem): ListItem {
    const content = [...item.content];
    if (typeof content[0] === 'string') {
        content[0] = content[0].replace(/^\s*:\*\s*/, '');
    }
    return { ...item, content };
}

function extractPortfolioItems(blocks: Block[]): BeerPortfolioItem[] {
    const items: BeerPortfolioItem[] = [];
    let style: InlineContent | null = null;

    for (const block of blocks) {
        if (block.type === 'heading' && block.level > 2) {
            style = block.content;
            continue;
        }

        if (block.type === 'list') {
            items.push(
                ...block.items.map((item) => ({
                    item: cleanBeerItem(item),
                    style,
                    labelImages: [],
                }))
            );
        }
    }

    return items;
}

interface LegacyLeadImage {
    image: ImageRef;
    caption: InlineContent;
    blocks: Block[];
}

/**
 * Some migrated external lead images survive as a paragraph containing one
 * direct image link. Promote only that unambiguous pre-heading shape and use
 * its authored label as the caption; normal editorial links remain blocks.
 */
function extractLinkedLeadImage(blocks: Block[]): LegacyLeadImage | null {
    const firstHeadingIndex = blocks.findIndex(
        (block) => block.type === 'heading'
    );
    const preambleEnd =
        firstHeadingIndex === -1 ? blocks.length : firstHeadingIndex;
    const paragraphIndex = blocks.slice(0, preambleEnd).findIndex(
        (block) =>
            block.type === 'paragraph' &&
            block.content.length === 1 &&
            typeof block.content[0] !== 'string' &&
            block.content[0].type === 'link' &&
            Boolean(block.content[0].href?.match(/\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i))
    );

    if (paragraphIndex === -1) return null;
    const paragraph = blocks[paragraphIndex];
    if (paragraph.type !== 'paragraph') return null;
    const link = paragraph.content[0];
    if (typeof link === 'string' || link.type !== 'link' || !link.href) {
        return null;
    }

    return {
        image: {
            url: link.href,
            source: 'external',
            alt: inlineText(link.content),
            width: null,
            caption: null,
        },
        caption: link.content,
        blocks: blocks.filter((_, index) => index !== paragraphIndex),
    };
}

function extractLegacyLeadImage(blocks: Block[]): LegacyLeadImage | null {
    const paragraphIndex = blocks.findIndex(
        (block) =>
            block.type === 'paragraph' &&
            block.content.some(
                (node) => typeof node === 'string' && /\[\[file:/i.test(node)
            )
    );
    if (paragraphIndex === -1) return null;

    const paragraph = blocks[paragraphIndex];
    if (paragraph.type !== 'paragraph') return null;
    const fileNodeIndex = paragraph.content.findIndex(
        (node) => typeof node === 'string' && /\[\[file:/i.test(node)
    );
    const first = paragraph.content[fileNodeIndex];
    if (typeof first !== 'string') return null;

    const fileMatch = first.match(/\[\[file:([^|\]]+)/i);
    if (!fileMatch) return null;
    const widthMatch = first.match(/\|(\d+)x?(?:px)?\|/i);
    const captionStart = first.lastIndexOf('|') + 1;
    const caption: InlineContent = [first.slice(captionStart)];
    const remaining: InlineContent = [];
    let closed = false;

    for (const node of paragraph.content.slice(fileNodeIndex + 1)) {
        if (!closed && typeof node === 'string' && node.includes(']]')) {
            const [captionEnd, ...bodyParts] = node.split(']]');
            caption.push(captionEnd);
            const body = bodyParts.join(']]').replace(/^\s*\n/, '');
            if (body) remaining.push(body);
            closed = true;
        } else if (!closed) {
            caption.push(node);
        } else {
            remaining.push(node);
        }
    }
    if (!closed) return null;

    const filename = canonicalFilename(fileMatch[1]);
    const hash = createHash('md5').update(filename).digest('hex');
    const image: ImageRef = {
        url: `https://assets.lambic.info/images/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(filename)}`,
        source: 'mediawiki-hashed',
        alt: null,
        width: widthMatch ? Number(widthMatch[1]) : null,
        caption: null,
    };
    const nextBlocks = [...blocks];
    if (remaining.length > 0) {
        nextBlocks[paragraphIndex] = { type: 'paragraph', content: remaining };
    } else {
        nextBlocks.splice(paragraphIndex, 1);
    }

    return { image, caption, blocks: nextBlocks };
}

function canonicalFilename(filename: string): string {
    const normalized = filename.trim().replaceAll(' ', '_');
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function convertLegacyGalleryParagraphs(blocks: Block[]): Block[] {
    return blocks.map((block) => {
        if (
            block.type !== 'paragraph' ||
            !block.content.every((node) => typeof node === 'string')
        ) {
            return block;
        }

        const source = block.content.join('');
        const galleryMatch = source.match(
            /^\s*<gallery>([\s\S]*?)<\/gallery>\s*([\s\S]*)$/i
        );
        if (!galleryMatch) return block;

        const trailingCaption = galleryMatch[2].trim();
        const items: Extract<Block, { type: 'gallery' }>['items'] = [];
        const filePattern = /File:([^|\r\n<]+)(?:\|([^\r\n<]*))?/gi;
        let match: RegExpExecArray | null;

        while ((match = filePattern.exec(galleryMatch[1])) !== null) {
            const filename = canonicalFilename(match[1]);
            const hash = createHash('md5').update(filename).digest('hex');
            const caption = match[2]?.trim() ||
                (items.length === 0 ? trailingCaption : '');
            items.push({
                url: `https://assets.lambic.info/images/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(filename)}`,
                source: 'mediawiki-hashed',
                caption: caption ? [caption] : null,
                alt: null,
            });
        }

        return items.length > 0
            ? {
                type: 'gallery',
                items,
                mode: null,
                heights: null,
                widths: null,
            }
            : block;
    });
}

function extractLeadBlockImages(blocks: Block[]): {
    image: ImageRef | null;
    caption: InlineContent | null;
    blocks: Block[];
} {
    const firstHeadingIndex = blocks.findIndex(
        (block) => block.type === 'heading'
    );
    const preambleEnd = firstHeadingIndex === -1 ? blocks.length : firstHeadingIndex;
    const leadImages = blocks
        .slice(0, preambleEnd)
        .filter((block) => block.type === 'image');
    const first = leadImages[0];

    if (!first || first.type !== 'image') {
        return { image: null, caption: null, blocks };
    }

    return {
        image: {
            url: first.url,
            source: first.source,
            alt: first.alt,
            width: first.width,
            caption: first.caption,
        },
        caption: first.caption ? [first.caption] : null,
        blocks: blocks.filter(
            (block, index) => !(index < preambleEnd && block.type === 'image')
        ),
    };
}

function getHeroDisplayWidth(image: ImageRef): string {
    if (!image.width) return 'fit-content';

    // Respect migrated display dimensions exactly. Small historical sources
    // should never be stretched to the shell's 450px maximum.
    return `min(${Math.min(image.width, 450)}px, 100%)`;
}

function removeInvalidGalleryItems(blocks: Block[]): Block[] {
    return blocks.map((block) => {
        if (block.type !== 'gallery') return block;
        return {
            ...block,
            items: block.items.filter((item) => {
                const filename = decodeURIComponent(item.url.split('/').at(-1) ?? '');
                return !/^\(?source[:_]/i.test(filename);
            }),
        };
    });
}

function isBackLinkParagraph(block: Block, page: Page): boolean {
    if (block.type !== 'paragraph' || !page.backTo) return false;

    const meaningfulNodes = block.content.filter(
        (node) => typeof node !== 'string' || node.trim().length > 0
    );
    const node = meaningfulNodes[0];

    return (
        meaningfulNodes.length === 1 &&
        typeof node !== 'string' &&
        node.type === 'link' &&
        node.linkType === 'internal' &&
        (node.targetTitle === page.backTo.title ||
            inlineText(node.content).trim().startsWith('←'))
    );
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
