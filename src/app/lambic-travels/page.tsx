import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
import type { Block } from '@/types/blocks';
import { notFound } from 'next/navigation';
import styles from './TravelsPage.module.css';

export const dynamic = 'force-dynamic';

const PAGE_SLUG = 'lambic-travels';

export default async function LambicTravelsPage() {
    const page = await getPageBySlug(PAGE_SLUG, 'info-article');

    if (!page) {
        notFound();
    }

    const contentBlocks = page.blocks.filter(block => !isMapEmbed(block));
    const mapBlocks = page.blocks.filter(isMapEmbed);

    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                {contentBlocks.length > 0 && (
                    <article className={styles.textWrapper}>
                        <BlockRenderer blocks={contentBlocks} />
                    </article>
                )}

                {mapBlocks.map((block, index) => (
                    <div className={styles.mapWrapper} key={index}>
                        <BlockRenderer blocks={[block]} />
                    </div>
                ))}
            </main>
            <Footer />
        </>
    );
}

function isMapEmbed(block: Block): block is Extract<Block, { type: 'rawHtml' }> {
    return block.type === 'rawHtml' && /<iframe\b/i.test(block.html);
}
