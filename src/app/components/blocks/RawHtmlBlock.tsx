import sanitizeHtml from 'sanitize-html';
import { RawHtmlBlock as RawHtmlBlockType } from '@/types/blocks';

export default function RawHtmlBlock({ html }: RawHtmlBlockType) {
    const sanitizedHtml = sanitizeHtml(html, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            a: ['href', 'name', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        transformTags: {
            a: sanitizeHtml.simpleTransform(
                'a',
                { rel: 'noopener noreferrer' },
                true
            ),
        },
    });

    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
