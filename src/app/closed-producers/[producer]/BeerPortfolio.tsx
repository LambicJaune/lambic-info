'use client';

import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import InlineRenderer from '@/app/components/blocks/InlineRenderer';
import type { Block, InlineContent, ListItem } from '@/types/blocks';
import { useEffect, useState } from 'react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaImages,
    FaTimes,
} from 'react-icons/fa';
import styles from './ClosedProducerPage.module.css';

interface LabelImage {
    url: string;
    alt: string | null;
}

export interface BeerPortfolioItem {
    item: ListItem;
    style: InlineContent | null;
    labelImages: LabelImage[];
}

interface Props {
    introduction: Block[];
    items: BeerPortfolioItem[];
}

export default function BeerPortfolio({ introduction, items }: Props) {
    const [selectedImages, setSelectedImages] = useState<LabelImage[] | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!selectedImages) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedImages(null);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [selectedImages]);

    const showImages = (images: LabelImage[]) => {
        setSelectedImages(images);
        setSelectedIndex(0);
    };

    return (
        <section className={styles.portfolioSection} data-link-icons="off">
            <details className={styles.accordionDetails}>
                <summary>
                    <h2 className={styles.centeredTitle}>Beer Portfolio</h2>
                </summary>

                {introduction.length > 0 && (
                    <div className={styles.portfolioIntroduction}>
                        <BlockRenderer blocks={introduction} />
                    </div>
                )}

                <div className={styles.tableWrapper}>
                    <table className={styles.logTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Style</th>
                                <th>Notes</th>
                                <th>Label(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(({ item, style, labelImages }, index) => (
                                <tr key={index}>
                                    <td data-label="Name" className={styles.boldCell}>
                                        <InlineRenderer content={item.content} />
                                    </td>
                                    <td data-label="Style">
                                        {style ? <InlineRenderer content={style} /> : 'N/A'}
                                    </td>
                                    <td data-label="Notes">N/A</td>
                                    <td data-label="Label(s)" className={styles.imageCell}>
                                        {labelImages.length > 0 ? (
                                            <button
                                                className={`${styles.thumbnailContainer} ${styles.clickableThumb}`}
                                                type="button"
                                                onClick={() => showImages(labelImages)}
                                                aria-label="View beer labels"
                                            >
                                                <img
                                                    src={labelImages[0].url}
                                                    alt={labelImages[0].alt ?? ''}
                                                    className={styles.tableThumb}
                                                />
                                                {labelImages.length > 1 && (
                                                    <span className={styles.imageStackCounter}>
                                                        <FaImages /> +{labelImages.length - 1}
                                                    </span>
                                                )}
                                            </button>
                                        ) : (
                                            <span className={styles.noImageText}>N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>

            {selectedImages && (
                <div
                    className={styles.lightboxOverlay}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Beer label images"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setSelectedImages(null);
                    }}
                >
                    <button className={styles.closeBtn} type="button" onClick={() => setSelectedImages(null)} aria-label="Close">
                        <FaTimes />
                    </button>
                    {selectedImages.length > 1 && (
                        <>
                            <button
                                className={styles.navBtnPrev}
                                type="button"
                                onClick={() => setSelectedIndex((index) => index === 0 ? selectedImages.length - 1 : index - 1)}
                                aria-label="Previous label"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                className={styles.navBtnNext}
                                type="button"
                                onClick={() => setSelectedIndex((index) => index === selectedImages.length - 1 ? 0 : index + 1)}
                                aria-label="Next label"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}
                    <div className={styles.lightboxContent}>
                        {selectedImages.length > 1 && (
                            <img
                                className={`${styles.portfolioSidePreview} ${styles.previewLeft}`}
                                src={selectedImages[
                                    selectedIndex === 0
                                        ? selectedImages.length - 1
                                        : selectedIndex - 1
                                ].url}
                                alt=""
                                aria-hidden="true"
                            />
                        )}
                        <img
                            className={styles.portfolioLightboxImage}
                            src={selectedImages[selectedIndex].url}
                            alt={selectedImages[selectedIndex].alt ?? ''}
                        />
                        {selectedImages.length > 1 && (
                            <img
                                className={`${styles.portfolioSidePreview} ${styles.previewRight}`}
                                src={selectedImages[
                                    selectedIndex === selectedImages.length - 1
                                        ? 0
                                        : selectedIndex + 1
                                ].url}
                                alt=""
                                aria-hidden="true"
                            />
                        )}
                        <p className={styles.imgCounter}>
                            {selectedIndex + 1} / {selectedImages.length}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
