import { InlineContent } from '@/types/blocks';
import Link from 'next/link';

export default function InlineRenderer({
    content,
    withinLink = false,
}: {
    content: InlineContent;
    withinLink?: boolean;
}) {
    return (
        <>
            {content.map((node, i) => {
                if (typeof node === 'string') {
                    return <span key={i}>{node}</span>;
                }

                switch (node.type) {
                    case 'bold':
                        return (
                            <strong key={i}>
                                <InlineRenderer content={node.content} withinLink={withinLink} />
                            </strong>
                        );

                    case 'italic':
                        return (
                            <em key={i}>
                                <InlineRenderer content={node.content} withinLink={withinLink} />
                            </em>
                        );

                    case 'link':
                        // Malformed legacy inline data can contain one link inside
                        // another. HTML forbids nested anchors, so retain the inner
                        // label while the outer link remains the clickable target.
                        if (withinLink) {
                            return (
                                <span key={i}>
                                    <InlineRenderer content={node.content} withinLink />
                                </span>
                            );
                        }

                        // Contract discrepancy to verify: LinkMark.href is typed as
                        // string, but the migration handoff allows null for broken links.
                        if (!node.href) {
                            return (
                                <span key={i}>
                                    <InlineRenderer content={node.content} withinLink={withinLink} />
                                </span>
                            );
                        }

                        if (node.linkType === 'internal') {
                            return (
                                <Link key={i} href={node.href} data-content-link>
                                    <InlineRenderer content={node.content} withinLink />
                                </Link>
                            );
                        }

                        return (
                            <a
                                key={i}
                                href={node.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-content-link
                            >
                                <InlineRenderer content={node.content} withinLink />
                            </a>
                        );

                    case 'footnoteMarker':
                        if (withinLink) {
                            return <sup key={i}>{node.number}</sup>;
                        }

                        return (
                            <sup key={i}>
                                <a
                                    href={`#reference-${node.number}`}
                                    aria-label={`Reference ${node.number}`}
                                >
                                    {node.number}
                                </a>
                            </sup>
                        );

                    default:
                        console.warn('Unknown inline node:', node);
                        return null;
                }
            })}
        </>
    );
}
