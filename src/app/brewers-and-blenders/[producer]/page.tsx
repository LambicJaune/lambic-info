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
    const { overviewBlocks, remainingBlocks } = splitProducerBlocks(
        page.blocks
    );
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
                                <ProducerSections blocks={remainingBlocks} />
                            </article>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function ProducerSections({ blocks }: { blocks: Block[] }) {
    const sections = groupTopLevelSections(blocks);

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
                    className={styles.beerSection}
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
