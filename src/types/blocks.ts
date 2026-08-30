/** * lambic.info v1 content schema — block-JSON contract * * Built against dump snapshot 2026-02-15. Parser-emitted shape; * source of truth for both the migration parser (Python) and the frontend * consumer (Next.js). Keep these in sync with block-schema.md. */

// ─── Page-type enum ─────────────────────────────────────────────────────────

export type PageType =
    | "brewer-or-blender" | "closed-producer" | "beer" | "info-article" | "bibliography" | "place" | "event";

// ─── Top-level page record ──────────────────────────────────────────────────

export interface Page {
    // Identity 
    id: number; // mwiki_page.page_id (stable across re-runs) 
    title: string; // canonical wiki title with underscores (e.g. "Brouwerij_3_Fonteinen") 
    slug: string; // URL-safe slug (lowercase, hyphenated) 
    pageType: PageType;
    displayTitle: string | null; // from {{DISPLAYTITLE:...}}, else null 
    
    // Migration provenance (carried through; nothing dropped at this stage) 
    needsReview: boolean;
    reviewReason: string | null;

    // Sourcing 
    sourceRevisionId: number; // mwiki_revision.rev_id of page_latest 
    snapshotDate: string; // dump snapshot date, ISO format 
    // Page-type-specific structured fields — all best-effort extracted from 
    // wikitext; null when absent. Consumers branch on pageType to know which 
    // are expected. 
    website: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
    openingHours: string | null;
    socials: SocialLink[] | null;
    logo: ImageRef | null; // sidebar producer logo
    banner: ImageRef | null; // hero banner 
    labelImage: ImageRef | null; // for beer pages — bottle/label image 
    backTo: BackLink | null; // for nested pages — the "← Parent" link 

    // Body content 
    blocks: Block[];
}

export interface SocialLink {
    type: "instagram" | "facebook" | "twitter" | "other";
    url: string;
}

export interface BackLink {
    title: string; // wiki title of the target 
    slug: string; // URL slug of the target 
    label: string; // human label as it appeared in wikitext (e.g. "3 Fonteinen") 
}


// ─── Image references ─────────────────────────────────────────────────────── 

export type ImageSource = "mediawiki-hashed" | "gcs-direct" | "external";
export interface ImageRef {
    url: string;
    source: ImageSource;
    alt: string | null;
    width: number | null; // pixels, if specified in wikitext 
    caption: string | null;
}

// ─── Block union ──────────────────────────────────────────────────────────── 
export type Block =
    | ParagraphBlock
    | HeadingBlock
    | ListBlock
    | TableBlock
    | ImageBlock
    | GalleryBlock
    | YoutubeBlock
    | VideoBlock
    | PdfBlock
    | AudioBlock
    | ReferencesBlock
    | RawHtmlBlock
    | HorizontalRuleBlock
    | UnhandledBlock;

// ─── Text-bearing blocks ────────────────────────────────────────────────────

export type InlineContent = InlineNode[];
export type InlineNode = string | InlineMark;
export type InlineMark =
    | BoldMark
    | ItalicMark
    | LinkMark
    | FootnoteMarker;

export interface BoldMark { type: "bold"; content: InlineContent; }
export interface ItalicMark { type: "italic"; content: InlineContent; }

export interface LinkMark {
    type: "link";
    href: string; // resolved route (relative for internal, absolute for external); null if broken 
    linkType: "internal" | "external";
    content: InlineContent; // visible label 
    targetTitle: string | null; // wiki title (only for linkType === "internal") 
    targetFragment: string | null; // section anchor (#Beers) if present 
}

export interface FootnoteMarker {
    type: "footnoteMarker";
    number: number; // parse-time-resolved 1-based footnote number 
    refName: string | null; // <ref name="…"> if named, else null 
}

export interface ParagraphBlock { type: "paragraph"; content: InlineContent; }

export interface HeadingBlock {
    type: "heading";
    level: 2 | 3 | 4 | 5 | 6; // h1 collapsed to h2 (h1 reserved for page title) 
    content: InlineContent;
    anchor: string; // slugified heading text, for in-page TOC/links 
}

// ─── Lists ────────────────────────────────────────────────────────────────── 
// 
export type ListStyle = "bullet" | "numbered" | "definition";
export interface ListBlock {
    type: "list";
    style: ListStyle;
    items: ListItem[];
}

export interface ListItem {
    content: InlineContent;
    children: ListItem[] | null; // nested sub-list 
    term: InlineContent | null; // for definition lists — the ; term 
}

// ─── Tables ───────────────────────────────────────────────────────────────── 

export interface TableBlock {
    type: "table";
    caption: InlineContent | null;
    rows: TableRow[];
    cssClass: string | null;
}

export interface TableRow { cells: TableCell[]; }

export interface TableCell {
    isHeader: boolean;
    content: InlineContent;
    colspan: number | null;
    rowspan: number | null;
}

// ─── Media blocks ─────────────────────────────────────────────────────────── 

export interface ImageBlock {
    type: "image";
    url: string;
    source: ImageSource;
    alt: string | null;
    caption: string | null;
    align: "left" | "right" | "center" | "none" | null;
    width: number | null;
    height: number | null;
}

export interface GalleryBlock {
    type: "gallery";
    items: GalleryItem[];
    mode: string | null;
    heights: number | null;
    widths: number | null;
}

export interface GalleryItem {
    url: string;
    source: ImageSource;
    caption: InlineContent | null;
    alt: string | null;
}

export interface YoutubeBlock {
    type: "youtube";
    videoId: string;
    width: number | null;
    height: number | null;
}

export interface VideoBlock {
    type: "video";
    provider: "vimeo";
    videoId: string;
    width: number | null;
    height: number | null;
}

export interface PdfBlock {
    type: "pdf";
    url: string;
    title: string;
    sizeBytes: number | null;
}

export interface AudioBlock {
    type: "audio";
    url: string;
}

export interface ReferencesBlock {
    type: "references";
    items: ReferenceItem[];
}

export interface ReferenceItem {
    number: number; // matches the FootnoteMarker that pointed here 
    refName: string | null;
    content: InlineContent;
}

export interface RawHtmlBlock {
    type: "rawHtml";
    html: string;
}

export interface HorizontalRuleBlock {
    type: "horizontalRule";
}

// ─── Escape hatch ─────────────────────────────────────────────────────────── 

export interface UnhandledBlock {
    type: "unhandled";
    reason: string;
    rawWikitext: string;
}

export type BlockType = Block["type"];

export const ALL_BLOCK_TYPES: BlockType[] = ["paragraph", "heading", "list", "table", "image", "gallery", "youtube", "video", "pdf", "audio", "references", "rawHtml", "horizontalRule", "unhandled",];