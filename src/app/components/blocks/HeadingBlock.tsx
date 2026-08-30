import { HeadingBlock as HeadingBlockType } from '@/types/blocks';
import InlineRenderer from './InlineRenderer';
import { JSX } from 'react';
import styles from './HeadingBlock.module.css';

export default function HeadingBlock({
    level,
    content,
    anchor,
}: HeadingBlockType) {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
        <HeadingTag id={anchor} className={styles.heading}>
            <InlineRenderer content={content} />
        </HeadingTag>
    );
}
