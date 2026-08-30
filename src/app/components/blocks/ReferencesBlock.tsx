import { ReferencesBlock as ReferencesBlockType } from '@/types/blocks';
import InlineRenderer from './InlineRenderer';

export default function ReferencesBlock({ items }: ReferencesBlockType) {
    return (
        <ol>
            {items.map((item) => (
                <li
                    key={item.number}
                    id={`reference-${item.number}`}
                    value={item.number}
                >
                    <InlineRenderer content={item.content} />
                </li>
            ))}
        </ol>
    );
}
