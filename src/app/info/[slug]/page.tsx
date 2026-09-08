import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import { createHash } from 'crypto';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import InlineRenderer from '@/app/components/blocks/InlineRenderer';
import { getPageBySlug } from '@/lib/pages';
import type { BackLink, Block, HeadingBlock, InlineContent } from '@/types/blocks';
import { notFound } from 'next/navigation';
import styles from './InfoPage.module.css';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

const infoSlugAliases: Record<string, string> = {
    'what-is-lambic': 'an-overview-of-lambic',
};

export default async function InfoPage({ params }: Props) {
    const { slug: routeSlug } = await params;
    const slug = infoSlugAliases[routeSlug] ?? routeSlug;
    const page = await getPageBySlug(slug, 'info-article');

    if (!page) {
        notFound();
    }

    const displayTitle = page.displayTitle ?? page.title.replaceAll('_', ' ');
    const filteredBlocks = page.blocks
        .filter(block => !isDuplicatedBackLink(block, page.backTo))
        .filter(block => shouldKeepInfoDragon(block, page.slug));
    const contentBlocks = page.slug === 'an-overview-of-lambic'
        ? reorderOverviewServingImage(filteredBlocks)
        : page.slug === 'the-language-of-lambic'
            ? repairLanguageOfLambicImages(filteredBlocks)
            : page.slug === 'brewing-lambic'
                ? reorderBrewingLambicImages(filteredBlocks)
                : page.slug === 'a-brief-history-of-lambic-in-belgium'
                    ? reorderBriefHistoryImage(filteredBlocks)
                    : page.slug === 'meerts'
                        ? reorderMeertsOverviewImage(filteredBlocks)
                        : page.slug === 'duivels-bier'
                            ? moveImageAfterHeading(filteredBlocks, /Vander_Linden_Duivels_Bier_Label\.jpg/i, 'overview')
                            : page.slug === 'beer-and-lambic-blends'
                                ? repairBeerAndLambicBlendsTable(filteredBlocks)
                                : page.slug === 'west-flanders'
                                    ? repairWestFlandersImage(filteredBlocks)
        : filteredBlocks;

    return (
        <>
            <GenericBanner backLink={getBackHref(page.backTo?.slug)} />
            <main className={styles.mainWrapper}>
                <h1 className={styles.pageTitle}>{displayTitle}</h1>

                <article className={styles.article}>
                    {['glossary', 'bibliography'].includes(page.slug)
                        ? <AlphabetizedInfoContent blocks={contentBlocks} pageTitle={displayTitle} />
                        : page.slug === 'museums'
                            ? <MuseumsContent blocks={contentBlocks} />
                            : page.slug === 'brewing-lambic'
                                ? <BrewingLambicContent blocks={contentBlocks} />
                        : <BlockRenderer blocks={contentBlocks} />}
                </article>
            </main>
            <Footer />
        </>
    );
}

function repairWestFlandersImage(blocks: Block[]): Block[] {
    return blocks.map(block => (
        block.type === 'image' && /Map_West_Flanders\.png/i.test(block.url)
            ? { ...block, align: 'right' as const }
            : block
    ));
}

function repairBeerAndLambicBlendsTable(blocks: Block[]): Block[] {
    return blocks.map(block => {
        if (block.type !== 'table' || block.rows.length === 0) return block;
        const columnCount = block.rows[0].cells.length;
        return {
            ...block,
            rows: block.rows.map((row, rowIndex) => ({
                ...row,
                cells: normalizeTableRow(row.cells, columnCount).map(cell => ({
                    ...cell,
                    isHeader: rowIndex === 0 ? true : cell.isHeader,
                    content: resolveLegacyTableImages(cell.content),
                })),
            })),
        };
    });
}

function normalizeTableRow(
    cells: Extract<Block, { type: 'table' }>['rows'][number]['cells'],
    columnCount: number,
) {
    const normalized = [...cells];
    while (
        normalized.length > columnCount &&
        inlineText(normalized.at(-1)?.content ?? []).trim() === ''
    ) {
        normalized.pop();
    }
    while (normalized.length < columnCount) {
        normalized.push({
            isHeader: false,
            content: [],
            colspan: null,
            rowspan: null,
        });
    }
    return normalized;
}

function resolveLegacyTableImages(content: InlineContent): InlineContent {
    return content.flatMap(node => {
        if (typeof node !== 'string') return [node];
        const resolved: InlineContent = [];
        let lastIndex = 0;
        const pattern = /\[\[File:([^|\]]+)(?:\|[^\]]*)?\]\]/gi;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(node)) !== null) {
            if (match.index > lastIndex) resolved.push(node.slice(lastIndex, match.index));
            const filename = canonicalMediawikiFilename(match[1]);
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

function canonicalMediawikiFilename(filename: string): string {
    const normalized = filename.trim().replaceAll(' ', '_');
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function shouldKeepInfoDragon(block: Block, pageSlug: string): boolean {
    if (block.type !== 'image' || !/LambicInfoDragon\.png/i.test(block.url)) return true;
    return ['brewing-lambic', 'a-brief-history-of-lambic-in-belgium'].includes(pageSlug);
}

function BrewingLambicContent({ blocks }: { blocks: Block[] }) {
    const firstSectionIndex = blocks.findIndex(block => block.type === 'heading' && block.level === 2);
    if (firstSectionIndex === -1) return <BlockRenderer blocks={blocks} />;

    const preface = blocks.slice(0, firstSectionIndex);
    const sections = groupHeadingSections(blocks.slice(firstSectionIndex));

    return (
        <>
            <BlockRenderer blocks={preface} />
            {sections.map((section, index) => {
                const heading = section[0];
                if (heading?.type !== 'heading') return <BlockRenderer blocks={section} key={`brewing-${index}`} />;
                if (heading.anchor === 'introduction') {
                    return <BlockRenderer blocks={section} key="brewing-introduction" />;
                }
                if (heading.anchor === 'references') {
                    return (
                        <div className={styles.glossaryReferences} key="brewing-references">
                            <BlockRenderer blocks={section} />
                        </div>
                    );
                }
                return (
                    <details className={`${styles.infoAccordion} ${styles.leftAlignedInfoAccordion}`} key={heading.anchor}>
                        <summary>
                            <BlockRenderer blocks={[heading]} />
                        </summary>
                        <div className={styles.infoAccordionContent}>
                            <BlockRenderer blocks={section.slice(1)} />
                        </div>
                    </details>
                );
            })}
        </>
    );
}

function reorderMeertsOverviewImage(blocks: Block[]): Block[] {
    return moveImageAfterHeading(blocks, /Boon_Meerts\.jpg/i, 'overview');
}

function reorderBriefHistoryImage(blocks: Block[]): Block[] {
    return moveImageAfterHeading(
        blocks,
        /LambicInfoDragon\.png/i,
        'a-brief-history-of-lambic-in-belgium',
    );
}

function reorderBrewingLambicImages(blocks: Block[]): Block[] {
    let reordered = moveImageAfterHeading(blocks, /LambicInfoDragon\.png/i, 'introduction');
    reordered = moveImageAfterHeading(reordered, /Cantillon_hops_aging\.jpg/i, 'raw-ingredients');
    reordered = moveImageAfterHeading(reordered, /Tilquin_barrel_blowoffs\.jpg/i, 'initial-fermentation');
    return reordered;
}

function moveImageAfterHeading(blocks: Block[], imagePattern: RegExp, headingAnchor: string): Block[] {
    const imageIndex = blocks.findIndex(block => block.type === 'image' && imagePattern.test(block.url));
    if (imageIndex === -1) return blocks;

    const reordered = [...blocks];
    const [image] = reordered.splice(imageIndex, 1);
    const headingIndex = reordered.findIndex(
        block => block.type === 'heading' && block.anchor === headingAnchor,
    );
    if (headingIndex === -1) return blocks;
    reordered.splice(headingIndex + 1, 0, image);
    return reordered;
}

function repairLanguageOfLambicImages(blocks: Block[]): Block[] {
    return blocks.map(block => {
        if (block.type !== 'image') return block;
        if (/Belgium_provinces_regions_striped\.png/i.test(block.url)) {
            return { ...block, align: 'right' as const };
        }
        if (/OldBridgeOverSenne\.jpg|FrenchFirstRepublic\.png/i.test(block.url)) {
            return { ...block, align: 'right' as const };
        }
        return block;
    });
}

function MuseumsContent({ blocks }: { blocks: Block[] }) {
    const firstSectionIndex = blocks.findIndex(block => block.type === 'heading' && block.level === 2);
    if (firstSectionIndex === -1) return <BlockRenderer blocks={blocks} />;

    const introBlocks = blocks.slice(0, firstSectionIndex);
    const sections = groupHeadingSections(blocks.slice(firstSectionIndex));

    return (
        <>
            <BlockRenderer blocks={introBlocks} />
            <div className={styles.infoAccordionList}>
                {sections.map((section, index) => {
                    const heading = section[0];
                    if (heading?.type !== 'heading') return <BlockRenderer blocks={section} key={`museum-${index}`} />;
                    if (heading.anchor === 'references') {
                        return (
                            <div className={styles.glossaryReferences} key="museum-references">
                                <BlockRenderer blocks={section} />
                            </div>
                        );
                    }
                    return (
                        <details className={styles.infoAccordion} key={heading.anchor}>
                            <summary>
                                <BlockRenderer blocks={[heading]} />
                            </summary>
                            <div className={styles.infoAccordionContent}>
                                <BlockRenderer blocks={section.slice(1)} />
                            </div>
                        </details>
                    );
                })}
            </div>
        </>
    );
}

function groupHeadingSections(blocks: Block[]): Block[][] {
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

function reorderOverviewServingImage(blocks: Block[]): Block[] {
    const reordered = [...blocks];
    const servingImageIndex = reordered.findIndex(
        block => block.type === 'image' && /Pouring\.jpg/i.test(block.url),
    );
    const servingHeadingIndex = reordered.findIndex(
        block => block.type === 'heading' && block.anchor === 'serving-lambic',
    );
    if (servingImageIndex !== -1 && servingHeadingIndex !== -1) {
        const [servingImage] = reordered.splice(servingImageIndex, 1);
        const updatedServingHeadingIndex = reordered.findIndex(
            block => block.type === 'heading' && block.anchor === 'serving-lambic',
        );
        const firstServingParagraphIndex = reordered.findIndex(
            (block, index) => index > updatedServingHeadingIndex && block.type === 'paragraph',
        );
        if (firstServingParagraphIndex !== -1) {
            reordered.splice(firstServingParagraphIndex + 1, 0, servingImage);
        }
    }

    return reordered;
}

function isDuplicatedBackLink(block: Block, backTo: BackLink | null): boolean {
    if (block.type !== 'paragraph' || !backTo) return false;
    const meaningfulNodes = block.content.filter(
        node => typeof node !== 'string' || node.trim().length > 0,
    );
    if (meaningfulNodes.length !== 1) return false;
    const node = meaningfulNodes[0];
    if (typeof node === 'string' || node.type !== 'link' || node.linkType !== 'internal') return false;

    const hrefSlug = node.href.split('#')[0].replace(/^\/+|\/+$/g, '').split('/').at(-1);
    return (
        node.targetTitle === backTo.title ||
        hrefSlug === backTo.slug ||
        inlineText(node.content).trim().startsWith('←')
    );
}

function inlineText(content: InlineContent): string {
    return content.map(node => {
        if (typeof node === 'string') return node;
        if (node.type === 'footnoteMarker') return '';
        return inlineText(node.content);
    }).join('');
}

function AlphabetizedInfoContent({ blocks, pageTitle }: { blocks: Block[]; pageTitle: string }) {
    const firstLetterIndex = blocks.findIndex(isLetterHeading);
    if (firstLetterIndex === -1) return <BlockRenderer blocks={blocks} />;

    const referencesIndex = blocks.findIndex(
        block => block.type === 'heading' && block.anchor === 'references',
    );
    const letterEnd = referencesIndex === -1 ? blocks.length : referencesIndex;
    const introBlocks = blocks
        .slice(0, firstLetterIndex)
        .filter(block => !(
            block.type === 'heading' &&
            ['sections', 'author-s-last-name'].includes(block.anchor)
        ))
        .filter(block => !(
            block.type === 'paragraph' &&
            block.content.some(node => typeof node === 'string' && /<noinclude>|A\s*\|\s*B\s*\|/i.test(node))
        ));
    const letterGroups = groupGlossaryLetters(blocks.slice(firstLetterIndex, letterEnd));
    const trailingBlocks = referencesIndex === -1 ? [] : blocks.slice(referencesIndex);

    return (
        <>
            <nav className={styles.alphabetNav} aria-label={`${pageTitle} alphabet`} data-link-icons="off">
                {letterGroups.map(({ heading }) => (
                    <a className={styles.navLink} href={`#${heading.anchor}`} key={heading.anchor}>
                        <InlineRenderer content={heading.content} />
                    </a>
                ))}
            </nav>

            <BlockRenderer blocks={introBlocks} />

            <div className={styles.glossaryLetters}>
                {letterGroups.map(({ heading, content }) => (
                    <details className={styles.letterAccordion} id={heading.anchor} key={heading.anchor}>
                        <summary className={styles.letterHeader}>
                            <span><InlineRenderer content={heading.content} /></span>
                            <span className={styles.plusIcon} aria-hidden="true">+</span>
                        </summary>
                        <div className={styles.letterContent}>
                            <BlockRenderer blocks={content} />
                        </div>
                    </details>
                ))}
            </div>

            <div className={styles.glossaryReferences}>
                <BlockRenderer blocks={trailingBlocks} />
            </div>
        </>
    );
}

function isLetterHeading(block: Block): block is HeadingBlock {
    return block.type === 'heading' && /^[a-z]$/i.test(block.anchor);
}

function groupGlossaryLetters(blocks: Block[]): { heading: HeadingBlock; content: Block[] }[] {
    const groups: { heading: HeadingBlock; content: Block[] }[] = [];
    for (const block of blocks) {
        if (isLetterHeading(block)) {
            groups.push({ heading: block, content: [] });
        } else {
            groups.at(-1)?.content.push(block);
        }
    }
    return groups;
}

function getBackHref(slug?: string) {
    if (!slug || slug === 'home') return '/';
    return `/info/${slug}`;
}
