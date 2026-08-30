'use client';

import { useEffect, useState } from 'react';
import { GalleryBlock as GalleryBlockType } from '@/types/blocks';
import InlineRenderer from './InlineRenderer';
import styles from './GalleryBlock.module.css';

export default function GalleryBlock({
    items,
    heights,
    widths,
}: GalleryBlockType) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedItem = selectedIndex === null ? null : items[selectedIndex];

    useEffect(() => {
        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setSelectedIndex(null);
            }
        }

        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, []);

    // Gallery `mode` is not mapped yet. All migrated galleries currently use
    // the same responsive thumbnail grid and retain their optional dimensions.
    return (
        <>
            <div className={styles.gallery}>
                {items.map((item, index) => (
                    <figure
                        className={styles.item}
                        key={`${item.url}-${index}`}
                    >
                        <button
                            className={styles.thumbnailButton}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            aria-label={`Enlarge ${item.alt ?? `gallery image ${index + 1}`}`}
                        >
                            <img
                                className={styles.thumbnail}
                                src={item.url}
                                alt={item.alt ?? ''}
                                width={widths ?? undefined}
                                height={heights ?? undefined}
                                loading="lazy"
                            />
                        </button>

                        {item.caption && (
                            <figcaption>
                                <InlineRenderer content={item.caption} />
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>

            {selectedItem && (
                <div
                    className={styles.lightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Enlarged gallery image"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedIndex(null);
                        }
                    }}
                >
                    <button
                        className={styles.closeButton}
                        type="button"
                        onClick={() => setSelectedIndex(null)}
                        aria-label="Close enlarged image"
                    >
                        ×
                    </button>
                    <figure className={styles.enlargedFigure}>
                        <img
                            className={styles.enlargedImage}
                            src={selectedItem.url}
                            alt={selectedItem.alt ?? ''}
                        />
                        {selectedItem.caption && (
                            <figcaption>
                                <InlineRenderer
                                    content={selectedItem.caption}
                                />
                            </figcaption>
                        )}
                    </figure>
                </div>
            )}
        </>
    );
}
