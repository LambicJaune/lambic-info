import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import ImageBlock from '@/app/components/blocks/ImageBlock';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
import type { BackLink, Block, HeadingBlock, ImageBlock as ImageBlockType, ImageRef, InlineContent } from '@/types/blocks';
import { createHash } from 'node:crypto';
import { notFound } from 'next/navigation';
import styles from './BeerPage.module.css';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ producer: string; category: string; beer: string }>;
}

export default async function BeerDetailPage({ params }: Props) {
    const { producer, beer } = await params;
    if (beer.toLowerCase() === 'adam-stephanie-july-9th-2016') notFound();
    const page = await getPageBySlug(beer.toLowerCase(), 'beer');
    if (!page || (page.backTo?.slug && page.backTo.slug !== producer.toLowerCase())) notFound();

    const displayTitle = page.displayTitle ?? page.title.replaceAll('_', ' ');
    const prepared = prepareBeer(page.blocks, page.labelImage, page.backTo);
    const producerSlug = page.backTo?.slug ?? producer.toLowerCase();
    const producerLabel = page.backTo?.label || page.backTo?.title.replaceAll('_', ' ') || producer.replaceAll('-', ' ');

    return (
        <>
            <GenericBanner
                backLink={`/brewers-and-blenders/${producerSlug}`}
                backLabel={`BACK TO ${producerLabel}`}
                mobileBackLabel="BACK"
            />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1>{displayTitle}</h1>
                </section>

                <div className={styles.pageContent}>
                    <article className={styles.contentWrapper}>
                        {prepared.label && (
                            <div
                                className={styles.labelImage}
                                style={{ width: getHeroDisplayWidth(prepared.label) }}
                            >
                                <ImageBlock {...toImageBlock(prepared.label)} />
                            </div>
                        )}
                        <BeerContent blocks={prepared.blocks} />
                    </article>
                </div>
            </main>
            <Footer />
        </>
    );
}

function BeerContent({ blocks }: { blocks: Block[] }) {
    return groupSections(blocks).map((section, index) => {
        const heading = section[0];
        if (isBottleLogHeading(heading)) {
            return (
                <details className={styles.bottleLog} key={`bottle-log-${index}`}>
                    <summary><h2>Bottle Log</h2></summary>
                    <div className={styles.bottleLogContent}>
                        <BlockRenderer blocks={section.slice(1)} />
                    </div>
                </details>
            );
        }

        return (
            <section
                className={[
                    isReferencesHeading(heading) ? styles.referencesSection : styles.contentSection,
                    isLabelHeading(heading) ? styles.labelSection : '',
                ].filter(Boolean).join(' ')}
                key={`beer-section-${index}`}
            >
                <BlockRenderer blocks={section} />
            </section>
        );
    });
}

function groupSections(blocks: Block[]): Block[][] {
    const sections: Block[][] = [];
    let current: Block[] = [];
    for (const block of blocks) {
        if (block.type === 'heading' && block.level === 2 && current.length) {
            sections.push(current);
            current = [];
        }
        current.push(block);
    }
    if (current.length) sections.push(current);
    return sections;
}

function isBottleLogHeading(block: Block | undefined): block is HeadingBlock {
    return block?.type === 'heading' && /^bottle-log$/i.test(block.anchor);
}

function isReferencesHeading(block: Block | undefined): block is HeadingBlock {
    return block?.type === 'heading' && /^(?:references?|sources?)$/i.test(block.anchor);
}

function isLabelHeading(block: Block | undefined): block is HeadingBlock {
    return block?.type === 'heading' && /^labels?$/i.test(block.anchor);
}

function prepareBeer(
    blocks: Block[],
    labelImage: ImageRef | null,
    backTo: BackLink | null,
): { label: ImageRef | null; blocks: Block[] } {
    const withoutBackLinks = blocks.filter((block) => !isDuplicatedBackLink(block, backTo));
    const firstHeadingIndex = withoutBackLinks.findIndex((block) => block.type === 'heading');
    const leadImageIndex = withoutBackLinks.findIndex(
        (block, index) => block.type === 'image' && (firstHeadingIndex === -1 || index < firstHeadingIndex),
    );
    const leadImage = leadImageIndex === -1 ? null : withoutBackLinks[leadImageIndex] as ImageBlockType;
    const rawLabel = labelImage ?? (leadImage ? imageRefFromBlock(leadImage) : null);
    const label = rawLabel ? removeLegacyImageOptionCaption(rawLabel) : null;
    const content = withoutBackLinks.filter((block, index) => (
        index !== leadImageIndex && !(block.type === 'image' && label && block.url === label.url)
    ));

    return { label, blocks: repairLegacyTableImages(content) };
}

function repairLegacyTableImages(blocks: Block[]): Block[] {
    return blocks.map((block) => {
        if (block.type !== 'table') return block;
        return {
            ...block,
            rows: block.rows.map((row) => ({
                ...row,
                cells: row.cells.map((cell) => ({
                    ...cell,
                    content: resolveLegacyImages(cell.content),
                })),
            })),
        };
    });
}

function resolveLegacyImages(content: InlineContent): InlineContent {
    return content.flatMap((node) => {
        if (typeof node !== 'string') return [node];
        const resolved: InlineContent = [];
        let lastIndex = 0;
        const pattern = /\[\[File:([^|\]]+)(?:\|[^\]]*)?\]\]/gi;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(node)) !== null) {
            if (match.index > lastIndex) resolved.push(node.slice(lastIndex, match.index));
            const filename = canonicalFilename(match[1]);
            const hash = createHash('md5').update(filename).digest('hex');
            resolved.push({
                type: 'link',
                href: `https://assets.lambic.info/images/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(filename)}`,
                linkType: 'external',
                content: [filename.replaceAll('_', ' ')],
                targetTitle: null,
                targetFragment: null,
            });
            lastIndex = pattern.lastIndex;
        }
        if (lastIndex < node.length) resolved.push(node.slice(lastIndex));
        return resolved;
    });
}

function canonicalFilename(value: string): string {
    const filename = value.trim().replaceAll(' ', '_');
    return filename.charAt(0).toUpperCase() + filename.slice(1);
}

function isDuplicatedBackLink(block: Block, backTo: BackLink | null): boolean {
    if (block.type !== 'paragraph') return false;
    const meaningful = block.content.filter((node) => typeof node !== 'string' || node.trim());
    if (meaningful.length !== 1) return false;
    const node = meaningful[0];
    if (typeof node === 'string' || node.type !== 'link' || node.linkType !== 'internal') return false;
    const slug = node.href.split('#')[0].split('/').filter(Boolean).at(-1);
    return inlineText(node.content).startsWith('←') || Boolean(backTo && (node.targetTitle === backTo.title || slug === backTo.slug));
}

function inlineText(content: InlineContent): string {
    return content.map((node) => typeof node === 'string' ? node : node.type === 'footnoteMarker' ? '' : inlineText(node.content)).join('').trim();
}

function imageRefFromBlock(image: ImageBlockType): ImageRef {
    return { url: image.url, source: image.source, alt: image.alt, width: image.width, caption: image.caption };
}

function toImageBlock(image: ImageRef): ImageBlockType {
    return {
        type: 'image',
        url: image.url,
        source: image.source,
        alt: image.alt,
        caption: image.caption,
        align: 'right',
        width: image.width,
        height: null,
    };
}

function removeLegacyImageOptionCaption(image: ImageRef): ImageRef {
    return /^link\s*=\s*File:/i.test(image.caption?.trim() ?? '')
        ? { ...image, caption: null }
        : image;
}

function getHeroDisplayWidth(image: ImageRef): string {
    const beerHeroMaximum = 272;
    if (!image.width) return `min(${beerHeroMaximum}px, 100%)`;
    return `min(${Math.min(image.width, beerHeroMaximum)}px, 100%)`;
}
