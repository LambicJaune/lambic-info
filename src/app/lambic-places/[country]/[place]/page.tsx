import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
import type { Block, Page, SocialLink } from '@/types/blocks';
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
import styles from '../../PlacesPage.module.css';

export const dynamic = 'force-dynamic';

export default async function PlaceDetailPage({
    params,
}: {
    params: Promise<{ country: string; place: string }>;
}) {
    const { country, place } = await params;
    const page = await getPageBySlug(place.toLowerCase(), 'place');
    if (!page) notFound();

    const displayTitle = page.displayTitle ?? page.title.replaceAll('_', ' ');
    const prepared = preparePlace(page);

    return (
        <>
            <GenericBanner backLink={`/lambic-places/${country}`} />
            <main className={styles.pageContainer}>
                <section className={styles.placesTitleBanner}>
                    <h1 className={styles.noTransform}>{displayTitle}</h1>
                </section>

                <div className={styles.placeContentWrapper}>
                    <div className={styles.placeInnerContainer}>
                        <div className={styles.placeTopFlex}>
                            <PlaceSidebar page={page} logoUrl={prepared.logoUrl} displayTitle={displayTitle} />
                            <article className={styles.placeMainText}>
                                {page.banner && (
                                    <figure className={styles.placeHeroBanner}>
                                        <img src={page.banner.url} alt={page.banner.alt ?? `${displayTitle} banner`} />
                                    </figure>
                                )}
                                <div className={styles.placeOverview}>
                                    <BlockRenderer blocks={prepared.overview} />
                                </div>
                            </article>
                        </div>

                        <PlaceSections blocks={prepared.remaining} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function PlaceSidebar({ page, logoUrl, displayTitle }: { page: Page; logoUrl: string | null; displayTitle: string }) {
    return (
        <aside className={`${styles.placeSidebar} ${logoUrl ? '' : styles.placeSidebarWithoutLogo}`}>
            {logoUrl && (
                <div className={styles.placeLogoWrapper}>
                    <img src={logoUrl} alt={`${displayTitle} logo`} />
                </div>
            )}
            <div className={styles.placeInfoContainer}>
                {page.address && <InfoLine icon={<FaMapMarkerAlt />} value={page.address} />}
                {page.openingHours && <InfoLine icon={<FaClock />} value={page.openingHours} />}
                {page.phone && <InfoLine icon={<FaPhone />} value={page.phone} />}
                {page.email && <InfoLine icon={<FaEnvelope />} value={page.email} />}
                {(validWebsite(page.website) || page.socials?.length) && (
                    <div className={styles.socialWrapper}>
                        {validWebsite(page.website) && <Social href={page.website!} label="Website"><FaGlobe /></Social>}
                        {page.socials?.map((social, index) => (
                            <Social href={social.url} label={social.type} key={`${social.type}-${index}`}>
                                <SocialIcon social={social} />
                            </Social>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

function InfoLine({ icon, value }: { icon: React.ReactNode; value: string }) {
    return <div className={styles.infoLine}>{icon}<span>{value}</span></div>;
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={label}>{children}</a>;
}

function SocialIcon({ social }: { social: SocialLink }) {
    if (social.type === 'instagram') return <FaInstagram />;
    if (social.type === 'facebook') return <FaFacebookF />;
    if (social.type === 'twitter') return <FaTwitter />;
    return <FaGlobe />;
}

function validWebsite(value: string | null): boolean {
    return Boolean(value && /^https?:\/\//i.test(value));
}

function PlaceSections({ blocks }: { blocks: Block[] }) {
    return groupSections(blocks).map((section, index) => {
        const heading = section[0];
        if (heading?.type !== 'heading') return <BlockRenderer blocks={section} key={index} />;

        if (/references?|sources?/i.test(heading.anchor)) {
            return <section className={styles.placeReferences} key={heading.anchor}><BlockRenderer blocks={section} /></section>;
        }

        const isBeerList = /(?:^|-)beers?(?:-|$)/i.test(heading.anchor);

        return (
            <details className={styles.placeAccordion} key={`${heading.anchor}-${index}`} data-link-icons={isBeerList ? 'off' : undefined} data-beer-list={isBeerList ? '' : undefined}>
                <summary><BlockRenderer blocks={[heading]} /></summary>
                <div className={styles.placeAccordionContent}><BlockRenderer blocks={section.slice(1)} /></div>
            </details>
        );
    });
}

function preparePlace(page: Page): { logoUrl: string | null; overview: Block[]; remaining: Block[] } {
    const blocks = repairSplitImageCaption(page.blocks.filter((block) => !isLegacyPlaceNavigation(block)));
    const overviewIndex = blocks.findIndex((block) => block.type === 'heading' && block.anchor === 'overview');
    if (overviewIndex === -1) return { logoUrl: page.logo?.url ?? null, overview: [], remaining: blocks };

    const preamble = blocks.slice(0, overviewIndex);
    const migratedLogo = preamble.find((block) => block.type === 'image');
    const overviewHeading = blocks[overviewIndex];
    const nextOffset = blocks.slice(overviewIndex + 1).findIndex(
        (block) => block.type === 'heading' && overviewHeading.type === 'heading' && block.level <= overviewHeading.level
    );
    const end = nextOffset === -1 ? blocks.length : overviewIndex + 1 + nextOffset;

    return {
        logoUrl: page.logo?.url ?? (migratedLogo?.type === 'image' ? migratedLogo.url : null),
        overview: blocks.slice(overviewIndex, end),
        remaining: blocks.slice(end),
    };
}

function repairSplitImageCaption(blocks: Block[]): Block[] {
    return blocks.map((block, index) => {
        const previous = blocks[index - 1];
        if (block.type !== 'paragraph' || previous?.type !== 'image' || !previous.caption?.match(/Source:\s*\[https?:\/\//i)) return block;
        const content = [...block.content];
        if (typeof content[0] === 'string') content[0] = content[0].replace(/^\]\s*/, '');
        return { ...block, content };
    });
}

function isLegacyPlaceNavigation(block: Block): boolean {
    if (block.type !== 'paragraph') return false;
    return hasPlaceDirectoryLink(block.content) || /(?:back to|list of)\s+(?:lambic\s+)?(?:bars|caf[eé]s|restaurants|places)/i.test(inlineText(block.content));
}

function hasPlaceDirectoryLink(content: import('@/types/blocks').InlineContent): boolean {
    return content.some(node => {
        if (typeof node === 'string' || node.type === 'footnoteMarker') return false;
        if (node.type === 'link' && /\/list-of-lambic-bars-cafes-and-restaurants(?:#|$)/i.test(node.href)) return true;
        return hasPlaceDirectoryLink(node.content);
    });
}

function inlineText(content: import('@/types/blocks').InlineContent): string {
    return content.map(node => typeof node === 'string' ? node : node.type === 'footnoteMarker' ? '' : inlineText(node.content)).join('');
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
