import { ParagraphBlock as ParagraphBlockType } from "@/types/blocks";
import InlineRenderer from "./InlineRenderer";
import styles from "./ParagraphBlock.module.css";

export default function ParagraphBlock({
    content,
}: ParagraphBlockType) {
    const isStandaloneBold =
        content.length === 1 &&
        typeof content[0] !== "string" &&
        content[0].type === "bold";

    return (
        <p className={isStandaloneBold ? styles.standaloneBold : undefined}>
            <InlineRenderer content={content} />
        </p>
    );
}
