import { InlineContent } from '@/types/blocks';
import Link from 'next/link';

export default function InlineRenderer({
    content,
}: {
    content: InlineContent;
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
                                <InlineRenderer content={node.content} />
                            </strong>
                        );

                    case 'italic':
                        return (
                            <em key={i}>
                                <InlineRenderer content={node.content} />
                            </em>
                        );

                    case 'link':
                        // Contract discrepancy to verify: LinkMark.href is typed as
                        // string, but the migration handoff allows null for broken links.
                        if (!node.href) {
                            return (
                                <span key={i}>
                                    <InlineRenderer content={node.content} />
                                </span>
                            );
                        }

                        if (node.linkType === 'internal') {
                            return (
                                <Link key={i} href={node.href}>
                                    <InlineRenderer content={node.content} />
                                </Link>
                            );
                        }

                        return (
                            <a
                                key={i}
                                href={node.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InlineRenderer content={node.content} />
                            </a>
                        );

                    case 'footnoteMarker':
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
