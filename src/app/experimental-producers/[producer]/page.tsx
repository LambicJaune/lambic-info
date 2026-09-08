import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
import type { Block, InlineContent, Page, SocialLink } from '@/types/blocks';
import { notFound } from 'next/navigation';
import { FaClock, FaEnvelope, FaFacebookF, FaGlobe, FaInstagram, FaMapMarkerAlt, FaPhone, FaTwitter } from 'react-icons/fa';
import styles from './ExperimentalProducer.module.css';

export const dynamic = 'force-dynamic';

interface PortfolioRow {
    name: string;
    type: string;
    abv: string;
    bottlingDates: string;
    batchSize: string;
    sizes: string;
    notes: string;
}

export default async function ExperimentalProducerPage({ params }: { params: Promise<{ producer: string }> }) {
    const { producer } = await params;
    const page = await getPageBySlug(producer.toLowerCase(), 'info-article');
    if (!page || page.backTo?.slug !== 'list-of-experimental-lambic-breweries-and-blenders') notFound();

    const displayTitle = page.displayTitle ?? page.title.replaceAll('_', ' ');
    const prepared = prepareExperimentalPage(page);

    return (
        <>
            <GenericBanner backLink="/experimental-producers" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}><h1>{displayTitle}</h1></section>
                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>
                        {hasMetadata(page) && <ExperimentalMetadata page={page} displayTitle={displayTitle} />}
                        <div className={styles.mainTop}>
                            <article className={styles.experimentalIntroduction}><BlockRenderer blocks={prepared.introduction} /></article>
                        </div>
                        <ExperimentalSections blocks={prepared.beforePortfolio} />
                        {prepared.portfolio.length > 0 && <PortfolioTable rows={prepared.portfolio} />}
                        <ExperimentalSections blocks={prepared.afterPortfolio} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function ExperimentalMetadata({ page, displayTitle }: { page: Page; displayTitle: string }) {
    const metadataCount = Number(Boolean(page.address)) + Number(Boolean(page.logo)) + Number(Boolean(validWebsite(page.website) || page.socials?.length));
    return (
        <section className={`${styles.infoBar} ${metadataCount < 3 ? styles.infoBarCompact : ''}`} aria-label={`${displayTitle} information`}>
            {page.address && <div className={styles.metaItem}><span className={styles.metaLabel}><FaMapMarkerAlt /> Location</span><span className={styles.metaValue}>{page.address}</span></div>}
            {page.logo && <div className={`${styles.metaItem} ${styles.metaLogo}`}><img src={page.logo.url} alt={page.logo.alt ?? `${displayTitle} logo`} /></div>}
            {(validWebsite(page.website) || page.socials?.length) && <div className={`${styles.metaItem} ${styles.socialLinks}`}>
                    {validWebsite(page.website) && <Social href={page.website!} label="Website"><FaGlobe /></Social>}
                    {page.socials?.map((social, index) => <Social href={social.url} label={social.type} key={`${social.type}-${index}`}><SocialIcon social={social} /></Social>)}
                </div>}
        </section>
    );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
    return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>;
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

function hasMetadata(page: Page): boolean {
    return Boolean(page.logo || page.address || validWebsite(page.website) || page.socials?.length);
}

function PortfolioTable({ rows }: { rows: PortfolioRow[] }) {
    return (
        <section className={styles.accordionSection} data-link-icons="off">
            <details className={styles.portfolioDetails}>
                <summary><h2 className={styles.centeredTitle}>Beer Portfolio</h2></summary>
                <div className={styles.accordionContent}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.logTable}>
                            <thead><tr><th>Name</th><th>Type</th>{rows.some(row => row.abv !== 'N/A') && <th>ABV</th>}<th>Bottling Date(s)</th><th>Batch Size / Bottle Count</th><th>Size(s)</th><th>Notes</th></tr></thead>
                            <tbody>{rows.map((row, index) => (
                                <tr key={`${row.name}-${index}`}>
                                    <td data-label="Name">{row.name}</td><td data-label="Type">{row.type}</td>
                                    {rows.some(item => item.abv !== 'N/A') && <td data-label="ABV">{row.abv}</td>}
                                    <td data-label="Bottling Date(s)">{row.bottlingDates}</td><td data-label="Batch Size / Bottle Count">{row.batchSize}</td>
                                    <td data-label="Size(s)">{row.sizes}</td><td data-label="Notes">{row.notes}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                </div>
            </details>
        </section>
    );
}

function ExperimentalSections({ blocks }: { blocks: Block[] }) {
    const trailingBlock = blocks.at(-1);
    const hasLegacyBackLink = Boolean(trailingBlock && isExperimentalOverviewLink(trailingBlock));
    const contentBlocks = hasLegacyBackLink ? blocks.slice(0, -1) : blocks;
    const sections = groupSections(contentBlocks).map((section, index) => {
        const heading = section[0];
        if (heading?.type !== 'heading') return <BlockRenderer blocks={section} key={index} />;
        if (/references?|sources?/i.test(heading.anchor)) return <section className={styles.referencesSection} key={heading.anchor}><BlockRenderer blocks={section} /></section>;
        return <details className={styles.contentAccordion} key={`${heading.anchor}-${index}`}><summary><BlockRenderer blocks={[heading]} /></summary><div className={styles.accordionContent}><BlockRenderer blocks={section.slice(1)} /></div></details>;
    });
    if (hasLegacyBackLink) sections.push(<div className={styles.legacyBackLink} key="legacy-back-link"><a href="/experimental-producers">Back to Experimental Producers</a></div>);
    return sections;
}

function isExperimentalOverviewLink(block: Block): boolean {
    if (block.type !== 'paragraph') return false;
    return /(?:back to|list of) experimental/i.test(inlineText(block.content));
}

function prepareExperimentalPage(page: Page): { introduction: Block[]; beforePortfolio: Block[]; portfolio: PortfolioRow[]; afterPortfolio: Block[] } {
    const overviewIndex = page.blocks.findIndex((block) => block.type === 'heading' && block.anchor === 'overview');
    if (overviewIndex === -1) return { introduction: [], beforePortfolio: page.blocks, portfolio: [], afterPortfolio: [] };
    const overviewHeading = page.blocks[overviewIndex];
    const nextOffset = page.blocks.slice(overviewIndex + 1).findIndex((block) => block.type === 'heading' && overviewHeading.type === 'heading' && block.level <= overviewHeading.level);
    const overviewEnd = nextOffset === -1 ? page.blocks.length : overviewIndex + 1 + nextOffset;
    const introduction = page.blocks.slice(overviewIndex, overviewEnd);
    const rest = page.blocks.slice(overviewEnd);
    const terminalIndex = rest.findIndex((block) => block.type === 'heading' && /^(?:photos?|pictures?|videos?|references?|sources?|label-log)$/.test(block.anchor));
    const portfolioBlocks = terminalIndex === -1 ? rest : rest.slice(0, terminalIndex);
    const afterPortfolio = terminalIndex === -1 ? [] : rest.slice(terminalIndex);
    return { introduction, beforePortfolio: [], portfolio: extractPortfolio(portfolioBlocks), afterPortfolio };
}

function extractPortfolio(blocks: Block[]): PortfolioRow[] {
    const rows: PortfolioRow[] = [];
    const sections = groupSections(blocks);
    for (const section of sections) {
        const heading = section[0];
        if (heading?.type !== 'heading') continue;
        const title = inlineText(heading.content);
        const lists = section.filter((block) => block.type === 'list');
        const tables = section.filter((block) => block.type === 'table');
        if (/^(?:beer-list|blends)$/.test(heading.anchor) || lists.length || tables.length) {
            for (const list of lists) if (list.type === 'list') for (const item of list.items) rows.push(makePortfolioRow(inlineText(item.content), inlineText(item.content)));
            for (const table of tables) if (table.type === 'table') rows.push(...portfolioRowsFromTable(table));
            continue;
        }
        const notes = section.slice(1)
            .filter((block) => block.type === 'paragraph')
            .map((block) => block.type === 'paragraph' ? inlineText(block.content) : '')
            .filter((value) => value && !/^label(?:\s+text)?\b/i.test(value))
            .join(' ');
        rows.push(makePortfolioRow(title, notes));
    }
    return deduplicateRows(rows);
}

function makePortfolioRow(name: string, notes: string): PortfolioRow {
    const dates = uniqueMatches(notes, /\b(?:18|19|20)\d{2}(?:\s*[-–/]\s*(?:\d{2,4}))?\b/g);
    const counts = uniqueMatches(notes, /\b\d+(?:\s*[-–]\s*\d+)?\s+bottles?\b/gi);
    const sizes = uniqueMatches(notes, /\b\d+(?:[.,]\d+)?\s*(?:ml|cl|l)\b/gi);
    return { name, type: inferType(name), abv: 'N/A', bottlingDates: dates || 'N/A', batchSize: counts || 'N/A', sizes: sizes || 'N/A', notes: notes || 'N/A' };
}

function portfolioRowsFromTable(table: Extract<Block, { type: 'table' }>): PortfolioRow[] {
    const headers = table.rows[0]?.cells.map(cell => normalizeHeader(inlineText(cell.content))) ?? [];
    return table.rows.slice(1).map(row => {
        const values = new Map(headers.map((header, index) => [header, inlineText(row.cells[index]?.content ?? [])]));
        const name = valueFor(values, 'name');
        if (!name) return null;
        const ingredients = valueFor(values, 'blend ingredients');
        const originalNotes = valueFor(values, 'notes');
        const notes = [originalNotes, ingredients && `Blend ingredients: ${ingredients}`].filter(Boolean).join(' — ');
        return {
            name,
            type: valueFor(values, 'type', 'style') || inferType(name),
            abv: valueFor(values, 'abv', 'alcohol') || 'N/A',
            bottlingDates: valueFor(values, 'bottling dates', 'bottling date', 'bottle date') || 'N/A',
            batchSize: valueFor(values, 'batch size', 'bottle count') || 'N/A',
            sizes: valueFor(values, 'sizes', 'size') || 'N/A',
            notes: [notes, valueFor(values, 'best by') && `Best by: ${valueFor(values, 'best by')}`].filter(Boolean).join(' — ') || 'N/A',
        };
    }).filter((row): row is PortfolioRow => row !== null);
}

function normalizeHeader(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function valueFor(values: Map<string, string>, ...keys: string[]): string {
    for (const key of keys) {
        const value = values.get(key);
        if (value) return value;
    }
    return '';
}

function inferType(value: string): string {
    if (/gueu?ze/i.test(value)) return 'Gueuze';
    if (/kriek|cherr|raspber|frambo|fruitlamb|fruit lamb|grape|druiv|peach|blueber|sakura|ume|yuzu/i.test(value)) return 'Fruit Lambic';
    if (/lambic|lambik/i.test(value)) return 'Lambic';
    return 'Other Lambics';
}

function uniqueMatches(value: string, pattern: RegExp): string {
    return [...new Set(value.match(pattern) ?? [])].join(', ');
}

function deduplicateRows(rows: PortfolioRow[]): PortfolioRow[] {
    const seen = new Set<string>();
    return rows.filter((row) => { const key = row.name.trim().toLowerCase(); if (!key || seen.has(key)) return false; seen.add(key); return true; });
}

function groupSections(blocks: Block[]): Block[][] {
    const sections: Block[][] = [];
    let current: Block[] = [];
    for (const block of blocks) {
        if (block.type === 'heading' && block.level === 2 && current.length) { sections.push(current); current = []; }
        current.push(block);
    }
    if (current.length) sections.push(current);
    return sections;
}

function inlineText(content: InlineContent): string {
    return content
        .map((node) => typeof node === 'string' ? node : node.type === 'footnoteMarker' ? '' : inlineText(node.content))
        .join('')
        .replace(/<\/?u>/gi, '')
        .replace(/'''/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
