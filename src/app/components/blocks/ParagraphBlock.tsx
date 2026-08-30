import { ParagraphBlock as ParagraphBlockType } from "@/types/blocks";
import InlineRenderer from "./InlineRenderer";

export default function ParagraphBlock({
    content,
}: ParagraphBlockType) {
    return (
        <p>
            <InlineRenderer content={content} />
        </p>
    );
}