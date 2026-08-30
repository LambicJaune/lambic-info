import { TableBlock as TableBlockType } from "@/types/blocks";
import InlineRenderer from "./InlineRenderer";

export default function TableBlock({
    caption,
    rows,
    cssClass,
}: TableBlockType) {
    return (
        <table className={cssClass ?? undefined}>
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
                                    <InlineRenderer content={cell.content} />
                                </CellTag>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}