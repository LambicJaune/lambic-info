import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import InlineRenderer from '@/app/components/blocks/InlineRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
import type { Block, InlineContent, Page, SocialLink } from '@/types/blocks';
import { notFound } from 'next/navigation';
import {
    FaClock,
    FaEnvelope,
    FaFacebookF,
    FaGlobe,
    FaInstagram,
    FaMapMarkerAlt,
    FaPhone,
    FaTwitter,
} from 'react-icons/fa';
import styles from './ProducerPage.module.css';

export const dynamic = 'force-dynamic';

type SidebarDetailKind = 'address' | 'phone' | 'email' | 'hours';

interface SidebarDetail {
    kind: SidebarDetailKind;
    label: string;
    value: InlineContent;
}

const producerSlugAliases: Record<string, string> = {
    cantillon: 'brasserie-cantillon',
};

export default async function ProducerPage({
    params,
}: {
    params: Promise<{ producer: string }>;
}) {
    const { producer } = await params;
    const slug = producerSlugAliases[producer.toLowerCase()] ?? producer;

    const page = await getPageBySlug(slug, 'brewer-or-blender');

    if (!page) {
        notFound();
    }

    const displayTitle = page.displayTitle ?? page.title.replaceAll('_', ' ');
    const imageOrderedBlocks = page.slug === 'den-herberg'
        ? moveDenHerbergHistoryImages(page.blocks)
        : page.slug === 'hanssens-artisanaal-bvba'
            ? moveHanssensHistoryImages(page.blocks)
            : page.slug === 'het-boerenerf'
                ? moveHetBoerenerfHistoryImages(page.blocks)
            : page.blocks;
    const repairedBlocks = repairMalformedUrlReferences(imageOrderedBlocks);
    const { overviewBlocks, remainingBlocks } = splitProducerBlocks(repairedBlocks);
    const overviewHeading =
        overviewBlocks[0]?.type === 'heading' ? overviewBlocks[0] : null;
    const overviewContent = overviewHeading
        ? overviewBlocks.slice(1)
        : overviewBlocks;
    const sidebarDetails = buildSidebarDetails(page);

    return (
        <>
            <GenericBanner backLink="/brewers-and-blenders" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1>{displayTitle}</h1>
                </section>

                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.mainTop}>
                            <ProducerSidebar
                                page={page}
                                details={sidebarDetails}
                            />

                            <article className={styles.overview}>
                                {page.banner && (
                                    <figure className={styles.breweryBanner}>
                                        <img
                                            className={styles.bannerImage}
                                            src={page.banner.url}
                                            alt={
                                                page.banner.alt ??
                                                `${displayTitle} banner`
                                            }
                                        />
                                    </figure>
                                )}

                                {overviewHeading && (
                                    <div className={styles.overviewTitle}>
                                        <BlockRenderer
                                            blocks={[overviewHeading]}
                                        />
                                    </div>
                                )}

                                <BlockRenderer blocks={overviewContent} />
                            </article>
                        </div>

                        {remainingBlocks.length > 0 && (
                            <article className={styles.fullContent}>
                                <ProducerSections blocks={remainingBlocks} pageSlug={page.slug} />
                            </article>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function moveDenHerbergHistoryImages(blocks: Block[]): Block[] {
    const historyIndex = blocks.findIndex(block => block.type === 'heading' && block.anchor === 'history');
    const imageIndex = historyIndex - 1;
    if (historyIndex < 1 || blocks[imageIndex]?.type !== 'image' || blocks[imageIndex].align !== 'left') return blocks;
    const reordered = [...blocks];
    const [image] = reordered.splice(imageIndex, 1);
    reordered.splice(historyIndex, 0, image);
    const reorderedHistoryIndex = reordered.findIndex(block => block.type === 'heading' && block.anchor === 'history');
    const nextSectionIndex = reordered.findIndex((block, index) => index > reorderedHistoryIndex && block.type === 'heading' && block.level === 2);
    const buildingImageIndex = reordered.findIndex((block, index) => index > reorderedHistoryIndex && (nextSectionIndex === -1 || index < nextSectionIndex) && block.type === 'image' && /Den_Herberg_-_building_Buizingen\.jpg/i.test(block.url));
    const firstHistoryParagraphIndex = reordered.findIndex((block, index) => index > reorderedHistoryIndex && block.type === 'paragraph');
    if (buildingImageIndex !== -1 && firstHistoryParagraphIndex !== -1 && buildingImageIndex > firstHistoryParagraphIndex) {
        const [buildingImage] = reordered.splice(buildingImageIndex, 1);
        reordered.splice(firstHistoryParagraphIndex + 1, 0, buildingImage);
    }
    return reordered;
}

function moveHanssensHistoryImages(blocks: Block[]): Block[] {
    const reordered = [...blocks];
    let historyIndex = reordered.findIndex(block => block.type === 'heading' && block.anchor === 'history');
    const corkIndex = reordered.findIndex(block => block.type === 'image' && /HanssensCorks-1\.jpg/i.test(block.url));
    if (historyIndex === -1 || corkIndex === -1) return blocks;

    const [corks] = reordered.splice(corkIndex, 1);
    historyIndex = reordered.findIndex(block => block.type === 'heading' && block.anchor === 'history');
    reordered.splice(historyIndex + 1, 0, corks);

    const crateIndex = reordered.findIndex(block => block.type === 'image' && /HanssensArtisanaal-1\.jpg/i.test(block.url));
    const firstParagraphIndex = reordered.findIndex((block, index) => index > historyIndex && block.type === 'paragraph');
    if (crateIndex !== -1 && firstParagraphIndex !== -1) {
        const [crate] = reordered.splice(crateIndex, 1);
        const updatedFirstParagraphIndex = reordered.findIndex((block, index) => index > historyIndex && block.type === 'paragraph');
        reordered.splice(updatedFirstParagraphIndex + 1, 0, crate);
    }
    return reordered;
}

function moveHetBoerenerfHistoryImages(blocks: Block[]): Block[] {
    const reordered = [...blocks];

    let historyIndex = reordered.findIndex(block => block.type === 'heading' && block.anchor === 'history');
    const firstImageIndex = historyIndex - 1;
    const firstImage = reordered[firstImageIndex];
    if (historyIndex > 0 && firstImage?.type === 'image' && /Boerenerf_Eylenbosch\.JPG/i.test(firstImage.url)) {
        const [historyImage] = reordered.splice(firstImageIndex, 1);
        historyIndex = reordered.findIndex(block => block.type === 'heading' && block.anchor === 'history');
        reordered.splice(historyIndex + 1, 0, historyImage);
    }

    const courtyardIndex = reordered.findIndex(
        block => block.type === 'image' && /Boerenerf courtyard/i.test(block.caption ?? ''),
    );
    const brewingIndex = reordered.findIndex(
        block => block.type === 'heading' && block.anchor === 'brewing-and-blending-process',
    );
    if (courtyardIndex !== -1 && brewingIndex !== -1) {
        const [courtyard] = reordered.splice(courtyardIndex, 1);
        const updatedBrewingIndex = reordered.findIndex(
            block => block.type === 'heading' && block.anchor === 'brewing-and-blending-process',
        );
        reordered.splice(updatedBrewingIndex + 1, 0, courtyard);
    }
    return reordered;
}

function repairMalformedUrlReferences(blocks: Block[]): Block[] {
    const labels = new Map<string, string>();
    const recovered: { number: number; url: string; label: string }[] = [];
    let nextNumber = Math.max(0, ...blocks.flatMap(block => block.type === 'references' ? block.items.map(item => item.number) : [])) + 1;
    const cleaned = blocks.map((block) => {
        if (block.type !== 'paragraph') return block;
        let paragraphContent = block.content;
        const openingIndex = paragraphContent.findIndex(node => typeof node === 'string' && /<ref\b/i.test(node));
        const closingIndex = paragraphContent.findIndex((node, index) => index > openingIndex && typeof node === 'string' && /<\/ref>/i.test(node));
        if (openingIndex !== -1 && closingIndex !== -1) {
            const link = paragraphContent.slice(openingIndex, closingIndex + 1).find(node => typeof node !== 'string' && node.type === 'link' && /^https?:\/\//i.test(node.href));
            if (link && typeof link !== 'string' && link.type === 'link') {
                const number = nextNumber++;
                recovered.push({ number, url: link.href, label: inlineText(link.content) || link.href });
                const openingText = paragraphContent[openingIndex];
                const closingText = paragraphContent[closingIndex];
                const before = typeof openingText === 'string' ? openingText.replace(/<ref\b.*$/i, '') : '';
                const after = typeof closingText === 'string' ? closingText.replace(/^.*?<\/ref>/i, '') : '';
                paragraphContent = [
                    ...paragraphContent.slice(0, openingIndex),
                    before,
                    { type: 'footnoteMarker' as const, number, refName: null },
                    after,
                    ...paragraphContent.slice(closingIndex + 1),
                ];
            }
        }
        const content = paragraphContent.map((node, index, nodes) => {
            if (typeof node !== 'string' || !/<\/ref>/i.test(node)) return node;
            const marker = nodes[index - 1];
            const match = node.match(/^\s*(.*?)\s*<\/ref>/i);
            if (match && typeof marker !== 'string' && marker?.type === 'footnoteMarker' && marker.refName && /^https?:\/\//i.test(marker.refName)) {
                labels.set(marker.refName, match[1].trim());
                return node.replace(/^\s*.*?\s*<\/ref>/i, '');
            }
            return node.replace(/<\/?(?:ref|href)>/gi, '');
        });
        return { ...block, content };
    });

    return cleaned.map((block) => {
        if (block.type !== 'references') return block;
        const repairedItems = block.items.map((item) => {
            if (item.content.length || !item.refName || !/^https?:\/\//i.test(item.refName)) return item;
            const label = labels.get(item.refName) || item.refName;
            return {
                ...item,
                content: [{
                    type: 'link' as const,
                    href: item.refName,
                    linkType: 'external' as const,
                    content: [label],
                    targetTitle: null,
                    targetFragment: null,
                }],
            };
        });
        return {
            ...block,
            items: [...repairedItems, ...recovered.map(reference => ({
                number: reference.number,
                refName: null,
                content: [{ type: 'link' as const, href: reference.url, linkType: 'external' as const, content: [reference.label], targetTitle: null, targetFragment: null }],
            }))],
        };
    });
}

function ProducerSections({ blocks, pageSlug }: { blocks: Block[]; pageSlug: string }) {
    const sections = groupTopLevelSections(blocks);
    const usesLongFormBeerList = ['wofd-vergistingen', 'w-o-f-d-vergistingen'].includes(pageSlug);

    return sections.map((section, index) => {
        const heading = section[0];
        const isHeading = heading?.type === 'heading';
        const isAlwaysExpanded =
            isHeading &&
            ['beers', 'references', 'cantillon-zwanze-day'].includes(
                heading.anchor
            );

        if (isHeading && heading.anchor === 'beers') {
            return (
                <section
                    className={`${styles.beerSection} ${usesLongFormBeerList ? styles.longFormBeerSection : ''}`}
                    data-link-icons="off"
                    key={`beers-${index}`}
                >
                    <BlockRenderer blocks={section} />
                </section>
            );
        }

        if (isHeading && heading.anchor === 'references') {
            return (
                <section
                    className={styles.referencesSection}
                    key={`references-${index}`}
                >
                    <BlockRenderer blocks={section} />
                </section>
            );
        }

        const isSpecialBeerSeries =
            isHeading &&
            (heading.anchor === 'cantillon-zwanze-day' ||
                section.some(
                    (block) =>
                        block.type === 'heading' &&
                        /(?:^|-)series(?:$|-)/i.test(block.anchor)
                ));

        if (isSpecialBeerSeries) {
            return (
                <section
                    className={styles.specialBeerSeriesSection}
                    data-link-icons="off"
                    key={`series-${index}`}
                >
                    <BlockRenderer blocks={section} />
                </section>
            );
        }

        if (!isHeading || isAlwaysExpanded) {
            return <BlockRenderer key={`section-${index}`} blocks={section} />;
        }

        return (
            <details
                className={`${styles.accordionDetails} ${heading.anchor === 'videos' ? styles.videoSection : ''}`}
                key={`${heading.anchor}-${index}`}
            >
                <summary>
                    <BlockRenderer blocks={[heading]} />
                </summary>
                <div className={styles.accordionContent}>
                    <BlockRenderer blocks={section.slice(1)} />
                </div>
            </details>
        );
    });
}

function groupTopLevelSections(blocks: Block[]): Block[][] {
    const firstHeading = blocks.find((block) => block.type === 'heading');
    if (!firstHeading || firstHeading.type !== 'heading') return [blocks];

    const sections: Block[][] = [];
    let currentSection: Block[] = [];

    for (const block of blocks) {
        if (
            block.type === 'heading' &&
            block.level <= firstHeading.level &&
            currentSection.length > 0
        ) {
            sections.push(currentSection);
            currentSection = [];
        }
        currentSection.push(block);
    }

    if (currentSection.length > 0) sections.push(currentSection);
    return sections;
}

function splitProducerBlocks(blocks: Block[]) {
    const overviewIndex = blocks.findIndex(
        (block) => block.type === 'heading' && block.anchor === 'overview'
    );

    // Producer infobox fields are already rendered in the sidebar. When an
    // Overview heading exists, everything before it is migrated infobox
    // source and should not be rendered a second time in the article body.
    if (overviewIndex === -1) {
        return { overviewBlocks: blocks, remainingBlocks: [] };
    }

    const overviewHeading = blocks[overviewIndex];
    const nextSectionOffset = blocks
        .slice(overviewIndex + 1)
        .findIndex(
            (block) =>
                block.type === 'heading' &&
                overviewHeading.type === 'heading' &&
                block.level <= overviewHeading.level
        );
    const nextSectionIndex =
        nextSectionOffset === -1
            ? blocks.length
            : overviewIndex + 1 + nextSectionOffset;

    return {
        overviewBlocks: blocks.slice(overviewIndex, nextSectionIndex),
        remainingBlocks: blocks.slice(nextSectionIndex),
    };
}

function buildSidebarDetails(page: Page): SidebarDetail[] {
    const overviewIndex = page.blocks.findIndex(
        (block) => block.type === 'heading' && block.anchor === 'overview'
    );
    const preamble = page.blocks.slice(
        0,
        overviewIndex === -1 ? 0 : overviewIndex
    );
    const details: SidebarDetail[] = [];

    for (const block of preamble) {
        if (block.type !== 'paragraph') continue;

        const labelNode = block.content[0];
        if (typeof labelNode !== 'string' && labelNode?.type === 'bold') {
            const label = inlineText(labelNode.content)
                .trim()
                .replace(/:$/, '');
            const value = trimLeadingWhitespace(block.content.slice(1));
            const kind = classifySidebarDetail(label, value);

            if (kind && value.length > 0) {
                details.push({ kind, label, value });
            }
        } else if (details.length > 0) {
            // Preserve continuation lines such as "Closed Wed & Sun" with the
            // preceding labeled opening-hours entry.
            details[details.length - 1].value.push(' ', ...block.content);
        }
    }

    addStructuredFallback(details, 'address', 'Address', page.address);
    addStructuredFallback(details, 'phone', 'Phone', page.phone);
    addStructuredFallback(details, 'email', 'Email', page.email);
    addStructuredFallback(details, 'hours', 'Opening hours', page.openingHours);

    const detailOrder: Record<SidebarDetailKind, number> = {
        address: 0,
        hours: 1,
        phone: 2,
        email: 3,
    };

    return details
        .map((detail, sourceIndex) => ({ detail, sourceIndex }))
        .sort(
            (a, b) =>
                detailOrder[a.detail.kind] - detailOrder[b.detail.kind] ||
                a.sourceIndex - b.sourceIndex
        )
        .map(({ detail }) => detail);
}

function classifySidebarDetail(
    label: string,
    value: InlineContent
): SidebarDetailKind | null {
    const text = `${label} ${inlineText(value)}`;

    if (/\b(?:website|instagram|facebook|twitter)\b/i.test(label)) return null;
    if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text) || /email/i.test(label)) {
        return 'email';
    }
    if (
        /\+\d[\d\s()./-]{6,}/.test(text) ||
        /phone|telephone|contact/i.test(label)
    ) {
        return 'phone';
    }
    if (/hours?|opening|open|closed/i.test(label)) return 'hours';
    if (/address|location|brewery|blendery|warehouse|site/i.test(label)) {
        return 'address';
    }

    return null;
}

function addStructuredFallback(
    details: SidebarDetail[],
    kind: SidebarDetailKind,
    label: string,
    value: string | null
) {
    if (!value?.trim() || details.some((detail) => detail.kind === kind))
        return;
    details.push({ kind, label, value: [value] });
}

function trimLeadingWhitespace(content: InlineContent): InlineContent {
    const result = [...content];
    if (typeof result[0] === 'string') {
        result[0] = result[0].replace(/^\s+/, '');
        if (!result[0]) result.shift();
    }
    return result;
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

function ProducerSidebar({
    page,
    details,
}: {
    page: Page;
    details: SidebarDetail[];
}) {
    return (
        <aside className={styles.sidebar}>
            {page.logo && (
                <div className={styles.logoContainer}>
                    <img
                        className={styles.logoImage}
                        src={page.logo.url}
                        alt={
                            page.logo.alt ??
                            `${page.title.replaceAll('_', ' ')} logo`
                        }
                    />
                </div>
            )}

            <ul className={styles.breweryInfo}>
                {details.map((detail, index) => (
                    <li key={`${detail.kind}-${detail.label}-${index}`}>
                        <SidebarDetailIcon kind={detail.kind} />
                        <span
                            className={`${styles.detailText} ${styles[detail.kind]}`}
                        >
                            <strong className={styles.detailLabel}>
                                {detail.label}:
                            </strong>{' '}
                            {detail.kind === 'email' ? (
                                <a href={`mailto:${inlineText(detail.value)}`}>
                                    {inlineText(detail.value)}
                                </a>
                            ) : (
                                <InlineRenderer content={detail.value} />
                            )}
                        </span>
                    </li>
                ))}
            </ul>

            <div className={styles.socialLinks}>
                {page.website && (
                    <a
                        href={page.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Website"
                    >
                        <FaGlobe />
                    </a>
                )}
                {page.socials?.map((social) => (
                    <a
                        key={`${social.type}-${social.url}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.type}
                    >
                        <SocialIcon type={social.type} />
                    </a>
                ))}
            </div>
        </aside>
    );
}

function SidebarDetailIcon({ kind }: { kind: SidebarDetailKind }) {
    switch (kind) {
        case 'address':
            return <FaMapMarkerAlt aria-hidden="true" />;
        case 'phone':
            return <FaPhone aria-hidden="true" />;
        case 'email':
            return <FaEnvelope aria-hidden="true" />;
        case 'hours':
            return <FaClock aria-hidden="true" />;
    }
}

function SocialIcon({ type }: { type: SocialLink['type'] }) {
    switch (type) {
        case 'instagram':
            return <FaInstagram />;
        case 'facebook':
            return <FaFacebookF />;
        case 'twitter':
            return <FaTwitter />;
        default:
            return <FaGlobe />;
    }
}
