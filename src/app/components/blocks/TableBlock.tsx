import { InlineContent, TableBlock as TableBlockType } from "@/types/blocks";
import InlineRenderer from "./InlineRenderer";
import GalleryBlock from "./GalleryBlock";
import styles from "./TableBlock.module.css";

export default function TableBlock({
    caption,
    rows,
    cssClass,
}: TableBlockType) {
    const isWide = Math.max(0, ...rows.map(row => row.cells.length)) >= 8;

    return (
        <div className={styles.tableWrapper}>
            <table className={[styles.table, isWide ? styles.wideTable : '', cssClass].filter(Boolean).join(" ")}>
                {caption && (
                    <caption>
                        <InlineRenderer content={caption} />
                    </caption>
                )}

                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.cells.map((cell, cellIndex) => {
                                const CellTag = cell.isHeader ? "th" : "td";

                                return (
                                    <CellTag
                                        key={cellIndex}
                                        colSpan={cell.colspan ?? undefined}
                                        rowSpan={cell.rowspan ?? undefined}
                                    >
                                        <TableCellContent content={cell.content} />
                                    </CellTag>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableCellContent({ content }: { content: InlineContent }) {
    const items: Parameters<typeof GalleryBlock>[0]['items'] = [];
    const remaining = content.flatMap(node => {
        if (
            typeof node !== 'string' &&
            node.type === 'link' &&
            node.linkType === 'external' &&
            /^https:\/\/assets\.lambic\.info\/images\/.+\.(?:jpe?g|png|gif|webp|svg)(?:\?.*)?$/i.test(node.href)
        ) {
            items.push({
                url: node.href,
                source: 'mediawiki-hashed',
                caption: null,
                alt: inlineText(node.content),
            });
            return [];
        }
        return [node];
    });

    return (
        <>
            {remaining.length > 0 && <InlineRenderer content={remaining} />}
            {items.length > 0 && (
                <GalleryBlock
                    type="gallery"
                    items={items}
                    mode={null}
                    heights={null}
                    widths={96}
                />
            )}
        </>
    );
}

function inlineText(content: InlineContent): string {
    return content.map(node => {
        if (typeof node === 'string') return node;
        if (node.type === 'footnoteMarker') return '';
        return inlineText(node.content);
    }).join('');
}
