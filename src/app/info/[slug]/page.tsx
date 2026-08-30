import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPageBySlug } from '@/lib/pages';
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

    return (
        <>
            <GenericBanner backLink={getBackHref(page.backTo?.slug)} />
            <main className={styles.mainWrapper}>
                <h1 className={styles.pageTitle}>{displayTitle}</h1>

                <article className={styles.article}>
                    <BlockRenderer blocks={page.blocks} />
                </article>
            </main>
            <Footer />
        </>
    );
}

function getBackHref(slug?: string) {
    if (!slug || slug === 'home') return '/';
    return `/info/${slug}`;
}
