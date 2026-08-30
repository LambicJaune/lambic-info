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

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
    return blocks.map((block, i) => {
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
    });
}
