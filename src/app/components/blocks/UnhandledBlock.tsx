import { UnhandledBlock as UnhandledBlockType } from '@/types/blocks';
import styles from './UnhandledBlock.module.css';

export default function UnhandledBlock({
    reason,
    rawWikitext,
}: UnhandledBlockType) {
    return (
        <aside className={styles.warning} role="note">
            <strong>Unsupported migrated content: {reason}</strong>

            <details>
                <summary>Show source wikitext</summary>
                <pre>{rawWikitext}</pre>
            </details>
        </aside>
    );
}
