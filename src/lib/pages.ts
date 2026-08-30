import { supabase } from '@/lib/supabase';
import type {
    BackLink,
    Block,
    ImageRef,
    Page,
    PageType,
    SocialLink,
} from '@/types/blocks';

interface PageRow {
    id: number;
    title: string;
    slug: string;
    page_type: PageType;
    display_title: string | null;
    needs_review: boolean;
    review_reason: string | null;
    source_revision_id: number;
    snapshot_date: string;
    website: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
    opening_hours: string | null;
    socials: SocialLink[] | null;
    logo: ImageRef | null;
    banner: ImageRef | null;
    label_image: ImageRef | null;
    back_to: BackLink | null;
    blocks: Block[];
}

const PAGE_SELECT = [
    'id',
    'title',
    'slug',
    'page_type',
    'display_title',
    'needs_review',
    'review_reason',
    'source_revision_id',
    'snapshot_date',
    'website',
    'phone',
    'address',
    'email',
    'opening_hours',
    'socials',
    'logo',
    'banner',
    'label_image',
    'back_to',
    'blocks',
].join(',');

export async function getPageBySlug(
    slug: string,
    expectedPageType?: PageType
): Promise<Page | null> {
    let query = supabase.from('pages').select(PAGE_SELECT).eq('slug', slug);

    if (expectedPageType) {
        query = query.eq('page_type', expectedPageType);
    }

    const { data, error } = await query.maybeSingle<PageRow>();

    if (error) {
        throw new Error(`Failed to load page "${slug}": ${error.message}`);
    }

    return data ? mapPageRow(data) : null;
}

function mapPageRow(row: PageRow): Page {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        pageType: row.page_type,
        displayTitle: row.display_title,
        needsReview: row.needs_review,
        reviewReason: row.review_reason,
        sourceRevisionId: row.source_revision_id,
        snapshotDate: row.snapshot_date,
        website: row.website,
        phone: row.phone,
        address: row.address,
        email: row.email,
        openingHours: row.opening_hours,
        socials: row.socials,
        logo: row.logo,
        banner: row.banner,
        labelImage: row.label_image,
        backTo: row.back_to,
        blocks: row.blocks,
    };
}
