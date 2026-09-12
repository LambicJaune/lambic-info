import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
import type { BackLink, Block, HeadingBlock, ImageBlock, InlineContent } from '@/types/blocks';
import { notFound } from 'next/navigation';
import styles from '../../EventsPage.module.css';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ country: string; event: string }>;
}

export default async function EventDetailPage({ params }: Props) {
    const { country, event } = await params;
    const slug = event.toLowerCase();
    let page = await getPageBySlug(slug, 'event');
    if (!page) {
        const candidate = await getPageBySlug(slug);
        if (candidate && /lambic events?/i.test(candidate.backTo?.label ?? '')) page = candidate;
    }
    if (!page) notFound();

    const displayTitle = page.displayTitle ?? page.title.replaceAll('_', ' ');
    const prepared = prepareEvent(page.blocks, page.backTo);

    return (
        <>
            <GenericBanner backLink={`/lambic-events/${country.toLowerCase()}`} />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1 className={styles.noTransform}>{displayTitle}</h1>
                </section>

                <div className={styles.eventContent}>
                    <div className={styles.eventContentWrapper}>
                        <EventMetadataBar website={page.website ?? prepared.website} />

                        <article className={styles.eventBody}>
                            {prepared.hero && (
                                <figure
                                    className={styles.floatingImageWrapper}
                                    style={{ width: getHeroDisplayWidth(prepared.hero) }}
                                >
                                    <img
                                        src={prepared.hero.url}
                                        alt={prepared.hero.alt ?? displayTitle}
                                        width={prepared.hero.width ?? undefined}
                                        height={prepared.hero.height ?? undefined}
                                        className={styles.eventLabelImage}
                                    />
                                    {prepared.hero.caption && <figcaption>{prepared.hero.caption}</figcaption>}
                                </figure>
                            )}
                            <EventContent blocks={prepared.blocks} />
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function EventMetadataBar({ website }: { website: string | null }) {
    return (
        <div className={styles.eventInfoBar}>
            <MetadataItem label="Date / Timing" value="N/A" />
            <MetadataItem label="Frequency" value="N/A" />
            <MetadataItem label="Next Date" value="N/A" />
            <div className={styles.eventMetaItem}>
                <span className={styles.metaLabel}>Current Status</span>
                <span className={`${styles.statusBadge} ${styles.statusUnknown}`}>N/A</span>
            </div>
            <div className={styles.eventMetaItem}>
                <span className={styles.metaLabel}>Official Link</span>
                {website && /^https?:\/\//i.test(website) ? (
                    <a className={styles.officialLink} href={website} target="_blank" rel="noopener noreferrer">
                        Website
                    </a>
                ) : <span className={styles.metaValue}>N/A</span>}
            </div>
        </div>
    );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
    return (
        <div className={styles.eventMetaItem}>
            <span className={styles.metaLabel}>{label}</span>
            <span className={styles.metaValue}>{value}</span>
        </div>
    );
}

function EventContent({ blocks }: { blocks: Block[] }) {
    const sections = groupSections(blocks);
    const firstArchiveIndex = sections.findIndex((section) => isArchiveHeading(section[0]));
    const archiveEnd = firstArchiveIndex === -1
        ? -1
        : findArchiveEnd(sections, firstArchiveIndex);

    return (
        <>
            {sections.slice(0, firstArchiveIndex === -1 ? sections.length : firstArchiveIndex).map(renderEventSection)}
            {firstArchiveIndex !== -1 && (
                <details className={styles.accordionDetails}>
                    <summary><h2 className={styles.centeredTitle}>Event Archives</h2></summary>
                    <div className={styles.accordionContent}>
                        {sections.slice(firstArchiveIndex, archiveEnd).map(renderArchiveSection)}
                    </div>
                </details>
            )}
            {archiveEnd !== -1 && sections.slice(archiveEnd).map(renderEventSection)}
        </>
    );
}

function renderArchiveSection(section: Block[], index: number) {
    const heading = section[0];
    if (heading?.type !== 'heading') return renderEventSection(section, index);

    return (
        <details
            className={styles.archiveSubsection}
            key={`archive-section-${index}`}
            data-beer-list={heading.anchor === 'horal-mega-blend' ? '' : undefined}
            data-link-icons={heading.anchor === 'horal-mega-blend' ? 'off' : undefined}
        >
            <summary><BlockRenderer blocks={[heading]} /></summary>
            <div className={styles.archiveSubsectionContent}>
                <BlocksWithLocationAccordions blocks={section.slice(1)} />
            </div>
        </details>
    );
}

function BlocksWithLocationAccordions({ blocks }: { blocks: Block[] }) {
    const firstLocationIndex = blocks.findIndex(isLocationHeading);
    if (firstLocationIndex === -1) {
        return <BlockRenderer blocks={blocks} />;
    }

    const locationGroups = groupLocationSections(blocks.slice(firstLocationIndex));
    return (
        <>
            <BlockRenderer blocks={blocks.slice(0, firstLocationIndex)} />
            {locationGroups.map((group, groupIndex) => (
                <details className={styles.locationAccordion} key={`locations-${groupIndex}`}>
                    <summary><BlockRenderer blocks={[group[0]]} /></summary>
                    <div className={styles.locationAccordionContent}>
                        <BlockRenderer blocks={group.slice(1)} />
                    </div>
                </details>
            ))}
        </>
    );
}

function renderEventSection(section: Block[], index: number) {
    return (
        <section
            className={isReferencesHeading(section[0]) ? styles.referencesSection : styles.eventSection}
            key={`event-section-${index}`}
        >
            <BlockRenderer blocks={section} />
        </section>
    );
}

function findArchiveEnd(sections: Block[][], start: number): number {
    let index = start + 1;
    while (index < sections.length && !isPostArchiveHeading(sections[index][0])) index += 1;
    return index;
}

function isPostArchiveHeading(block: Block | undefined): boolean {
    return block?.type === 'heading' && /^(?:photos?|gallery|videos?|references?|sources?)$/i.test(block.anchor);
}

function groupLocationSections(blocks: Block[]): Block[][] {
    const groups: Block[][] = [];
    let current: Block[] = [];
    for (const block of blocks) {
        if (isLocationHeading(block) && current.length) {
            groups.push(current);
            current = [];
        }
        current.push(block);
    }
    if (current.length) groups.push(current);
    return groups;
}

function isLocationHeading(block: Block | undefined): block is HeadingBlock {
    return block?.type === 'heading' && block.level === 3 && /^locations?(?:-|$)/i.test(block.anchor);
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

function isArchiveHeading(block: Block | undefined): block is HeadingBlock {
    return block?.type === 'heading' && /^(?:past-|dates?$|event-archives?$|zwanze-day-\d{4}|lambic-list-\d{4}|.*edition.*\d{4})/i.test(block.anchor);
}

function isReferencesHeading(block: Block | undefined): block is HeadingBlock {
    return block?.type === 'heading' && /^(?:references?|sources?)$/i.test(block.anchor);
}

function prepareEvent(
    blocks: Block[],
    backTo: BackLink | null,
): { hero: ImageBlock | null; website: string | null; blocks: Block[] } {
    const filtered = blocks.filter((block) => !isDuplicatedBackLink(block, backTo));
    const firstHeading = filtered.findIndex((block) => block.type === 'heading');
    const heroIndex = filtered.findIndex((block, index) => block.type === 'image' && (firstHeading === -1 || index < firstHeading));
    const hero = heroIndex === -1 ? null : filtered[heroIndex] as ImageBlock;
    const website = filtered
        .map(legacyMetadata)
        .find((metadata) => metadata?.kind === 'website')?.url ?? null;
    return {
        hero,
        website,
        blocks: filtered.filter((block, index) => index !== heroIndex && !legacyMetadata(block)),
    };
}

function legacyMetadata(block: Block): { kind: 'website' | 'social'; url: string } | null {
    if (block.type !== 'paragraph') return null;
    const text = inlineText(block.content);
    const match = text.match(/^\s*(Website(?:\s*\([^)]*\))?|Facebook|Instagram|Twitter)\s*:\s*(https?:\/\/\S+)/i);
    if (!match) return null;
    return {
        kind: /^website/i.test(match[1]) ? 'website' : 'social',
        url: match[2],
    };
}

function isDuplicatedBackLink(block: Block, backTo: BackLink | null): boolean {
    if (block.type !== 'paragraph') return false;
    const meaningful = block.content.filter((node) => typeof node !== 'string' || node.trim());
    if (meaningful.length !== 1) return false;
    const node = meaningful[0];
    if (typeof node === 'string' || node.type !== 'link' || node.linkType !== 'internal') return false;
    const text = inlineText(node.content);
    const slug = node.href.split('#')[0].split('/').filter(Boolean).at(-1);
    return text.startsWith('←') || Boolean(backTo && (node.targetTitle === backTo.title || slug === backTo.slug));
}

function inlineText(content: InlineContent): string {
    return content.map((node) => typeof node === 'string' ? node : node.type === 'footnoteMarker' ? '' : inlineText(node.content)).join('').trim();
}

function getHeroDisplayWidth(image: ImageBlock): string {
    const eventHeroMaximum = 272;
    if (!image.width) return `min(${eventHeroMaximum}px, 100%)`;
    return `min(${Math.min(image.width, eventHeroMaximum)}px, 100%)`;
}
