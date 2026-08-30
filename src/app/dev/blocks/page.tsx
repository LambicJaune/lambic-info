import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import type { Block } from '@/types/blocks';

const testBlocks: Block[] = [
    {
        type: 'heading',
        level: 2,
        anchor: 'block-renderer-test',
        content: ['Block renderer visual test'],
    },
    {
        type: 'paragraph',
        content: [
            'Plain text, ',
            { type: 'bold', content: ['bold text'] },
            ', ',
            { type: 'italic', content: ['italic text'] },
            ', and ',
            {
                type: 'bold',
                content: [
                    'bold with ',
                    { type: 'italic', content: ['nested italic'] },
                ],
            },
            '. Internal link: ',
            {
                type: 'link',
                href: '/',
                linkType: 'internal',
                content: ['home'],
                targetTitle: 'Main_Page',
                targetFragment: null,
            },
            '. External link: ',
            {
                type: 'link',
                href: 'https://example.com',
                linkType: 'external',
                content: ['example.com'],
                targetTitle: null,
                targetFragment: null,
            },
            '. Broken link: ',
            {
                type: 'link',
                href: '',
                linkType: 'internal',
                content: ['missing target'],
                targetTitle: 'Missing_Page',
                targetFragment: null,
            },
            '. Footnote',
            { type: 'footnoteMarker', number: 1, refName: 'visual-test' },
            '.',
        ],
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'lists',
        content: ['Lists'],
    },
    {
        type: 'list',
        style: 'bullet',
        items: [
            {
                content: ['First bullet'],
                term: null,
                children: [
                    {
                        content: ['Nested child'],
                        term: null,
                        children: [
                            {
                                content: ['Deeply nested child'],
                                term: null,
                                children: null,
                            },
                        ],
                    },
                ],
            },
            {
                content: ['Second bullet'],
                term: null,
                children: null,
            },
        ],
    },
    {
        type: 'list',
        style: 'numbered',
        items: [
            {
                content: ['First numbered item'],
                term: null,
                children: null,
            },
            {
                content: ['Second numbered item'],
                term: null,
                children: [
                    {
                        content: ['Nested numbered child'],
                        term: null,
                        children: null,
                    },
                ],
            },
        ],
    },
    {
        type: 'list',
        style: 'definition',
        items: [
            {
                term: ['Lambic'],
                content: ['A spontaneously fermented beer.'],
                children: null,
            },
            {
                term: ['Gueuze'],
                content: ['A blend of young and old lambics.'],
                children: [
                    {
                        content: ['Often bottle-conditioned.'],
                        term: null,
                        children: null,
                    },
                ],
            },
        ],
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'table',
        content: ['Table'],
    },
    {
        type: 'table',
        caption: [
            'Simple table caption with ',
            { type: 'italic', content: ['formatting'] },
        ],
        cssClass: null,
        rows: [
            {
                cells: [
                    {
                        isHeader: true,
                        content: ['Name'],
                        colspan: null,
                        rowspan: null,
                    },
                    {
                        isHeader: true,
                        content: ['Region'],
                        colspan: null,
                        rowspan: null,
                    },
                ],
            },
            {
                cells: [
                    {
                        isHeader: false,
                        content: ['Cantillon'],
                        colspan: null,
                        rowspan: null,
                    },
                    {
                        isHeader: false,
                        content: ['Brussels'],
                        colspan: null,
                        rowspan: null,
                    },
                ],
            },
        ],
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'media',
        content: ['Images and gallery'],
    },
    {
        type: 'image',
        url: 'https://placehold.co/640x360?text=Image+without+dimensions',
        source: 'external',
        alt: 'Placeholder demonstrating an image without dimensions',
        caption: 'Image with null width and height',
        align: 'center',
        width: null,
        height: null,
    },
    {
        type: 'gallery',
        mode: null,
        heights: 160,
        widths: 240,
        items: [
            {
                url: 'https://placehold.co/480x320?text=Gallery+1',
                source: 'external',
                alt: 'First gallery placeholder',
                caption: [
                    'First caption with ',
                    { type: 'bold', content: ['bold text'] },
                ],
            },
            {
                url: 'https://placehold.co/480x320?text=Gallery+2',
                source: 'external',
                alt: 'Second gallery placeholder',
                caption: ['Second caption'],
            },
            {
                url: 'https://placehold.co/480x320?text=Gallery+3',
                source: 'external',
                alt: null,
                caption: null,
            },
        ],
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'references',
        content: ['References'],
    },
    {
        type: 'references',
        items: [
            {
                number: 1,
                refName: 'visual-test',
                content: [
                    'A reference with an ',
                    {
                        type: 'link',
                        href: 'https://example.com/source',
                        linkType: 'external',
                        content: ['external source'],
                        targetTitle: null,
                        targetFragment: null,
                    },
                    '.',
                ],
            },
        ],
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'documents',
        content: ['Documents'],
    },
    {
        type: 'pdf',
        url: 'https://assets.lambic.info/images/b/bb/Antoine1908LaBrasserieDeLambic.pdf',
        title: 'La Brasserie de Lambic',
        sizeBytes: 639678,
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'audio',
        content: ['Audio'],
    },
    {
        type: 'audio',
        url: 'https://assets.lambic.info/media/cantillon/example.mp3',
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'youtube',
        content: ['YouTube'],
    },
    {
        type: 'youtube',
        videoId: 'dQw4w9WgXcQ',
        width: 560,
        height: 315,
    },
    {
        type: 'video',
        provider: 'vimeo',
        videoId: '76979871',
        width: 560,
        height: 315,
    },
    {
        type: 'heading',
        level: 3,
        anchor: 'raw-html',
        content: ['Raw HTML'],
    },
    {
        type: 'rawHtml',
        html: '<p>Sanitized HTML with <strong>formatting</strong> and an <a href="https://example.com" target="_blank">external link</a>.</p><script>alert("removed")</script>',
    },
    {
        type: 'horizontalRule',
    },
    {
        type: 'paragraph',
        content: ['Content following a horizontal rule.'],
    },
    {
        type: 'unhandled',
        reason: 'Development fixture for unsupported migrated syntax',
        rawWikitext: '{{Unsupported template|example=value}}',
    },
];

export default function BlocksDevelopmentPage() {
    return (
        <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
            <style>{`
                table {
                    border-collapse: collapse;
                    margin: 1rem 0;
                }

                caption {
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }

                th,
                td {
                    border: 1px solid black;
                    padding: 0.5rem 1rem;
                    text-align: left;
                }
            `}</style>

            <BlockRenderer blocks={testBlocks} />
        </main>
    );
}
