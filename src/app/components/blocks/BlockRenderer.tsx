import { Block } from '@/types/blocks';

import ParagraphBlock from './ParagraphBlock';
import HeadingBlock from './HeadingBlock';
import ImageBlock from './ImageBlock';
import GalleryBlock from './GalleryBlock';
import ListBlock from './ListBlock';
import TableBlock from './TableBlock';
import ReferencesBlock from './ReferencesBlock';
import PdfBlock from './PdfBlock';
import AudioBlock from './AudioBlock';
import YoutubeBlock from './YoutubeBlock';
import VideoBlock from './VideoBlock';
import RawHtmlBlock from './RawHtmlBlock';
import HorizontalRuleBlock from './HorizontalRuleBlock';
import UnhandledBlock from './UnhandledBlock';
import styles from './BlockRenderer.module.css';

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
    const rendered: React.ReactNode[] = [];

    for (let i = 0; i < blocks.length; i += 1) {
        const block = blocks[i];
        if (isBlockquoteMarker(block, 'open')) {
            const closingIndex = blocks.findIndex((candidate, index) => index > i && isBlockquoteMarker(candidate, 'close'));
            if (closingIndex !== -1) {
                rendered.push(<blockquote className={styles.blockquote} key={`blockquote-${i}`}><BlockRenderer blocks={blocks.slice(i + 1, closingIndex)} /></blockquote>);
                i = closingIndex;
                continue;
            }
        }
        if (block.type === 'youtube' || block.type === 'video') {
            const videoBlocks: Block[] = [];
            while (i < blocks.length && (blocks[i].type === 'youtube' || blocks[i].type === 'video')) {
                videoBlocks.push(blocks[i]);
                i += 1;
            }
            i -= 1;
            rendered.push(<div className={styles.videoGroup} key={`videos-${i}`}>{videoBlocks.map((video, index) => renderBlock(video, index))}</div>);
            continue;
        }
        rendered.push(renderBlock(block, i));
    }

    return rendered;
}

function isBlockquoteMarker(block: Block, kind: 'open' | 'close'): boolean {
    if (block.type !== 'paragraph' || block.content.length !== 1 || typeof block.content[0] !== 'string') return false;
    const value = block.content[0].trim();
    return kind === 'open' ? /^<blockquote\b[^>]*>$/i.test(value) : /^<\/blockquote>$/i.test(value);
}

function renderBlock(block: Block, i: number) {
        switch (block.type) {
            case 'paragraph':
                return <ParagraphBlock key={i} {...block} />;

            case 'heading':
                return <HeadingBlock key={i} {...block} />;

            case 'list':
                return <ListBlock key={i} {...block} />;

            case 'table':
                return <TableBlock key={i} {...block} />;

            case 'image':
                return <ImageBlock key={i} {...block} />;

            case 'gallery':
                return <GalleryBlock key={i} {...block} />;

            case 'references':
                return <ReferencesBlock key={i} {...block} />;

            case 'pdf':
                return <PdfBlock key={i} {...block} />;

            case 'audio':
                return <AudioBlock key={i} {...block} />;

            case 'youtube':
                return <YoutubeBlock key={i} {...block} />;

            case 'video':
                return <VideoBlock key={i} {...block} />;

            case 'rawHtml':
                return <RawHtmlBlock key={i} {...block} />;

            case 'horizontalRule':
                return <HorizontalRuleBlock key={i} {...block} />;

            case 'unhandled':
                return <UnhandledBlock key={i} {...block} />;

            default:
                console.warn('Unsupported block:', block);
                return null;
        }
}
