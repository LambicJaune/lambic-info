import { getPageBySlug } from '@/lib/pages';
import { notFound, redirect } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Compatibility entry point for migrated MediaWiki links. Inline block data
 * retains flat paths such as `/brasserie-cantillon`, while the application
 * groups page types beneath route-specific prefixes.
 */
export default async function LegacyPageLink({ params }: Props) {
    const { slug } = await params;
    const page = await getPageBySlug(slug.toLowerCase());

    if (!page) notFound();

    switch (page.pageType) {
        case 'brewer-or-blender':
            redirect(`/brewers-and-blenders/${page.slug}`);
        case 'closed-producer':
            redirect(`/closed-producers/${page.slug}`);
        case 'info-article':
            redirect(`/info/${page.slug}`);
        default:
            // Detail routes for the remaining page types do not yet share a
            // stable URL shape, so avoid guessing an incorrect destination.
            notFound();
    }
}
