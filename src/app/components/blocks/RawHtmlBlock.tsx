import sanitizeHtml from 'sanitize-html';
import { RawHtmlBlock as RawHtmlBlockType } from '@/types/blocks';

export default function RawHtmlBlock({ html }: RawHtmlBlockType) {
    const sanitizedHtml = sanitizeHtml(html, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'iframe'],
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            a: ['href', 'name', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
            iframe: ['src', 'title', 'width', 'height', 'loading', 'allowfullscreen'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedIframeHostnames: ['www.google.com'],
        transformTags: {
            a: sanitizeHtml.simpleTransform(
                'a',
                { rel: 'noopener noreferrer' },
                true
            ),
        },
    });

    return <div data-block="raw-html" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
