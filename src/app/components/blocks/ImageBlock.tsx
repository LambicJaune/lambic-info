'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageBlock as ImageBlockType } from '@/types/blocks';
import styles from './ImageBlock.module.css';

export default function ImageBlock({
    url,
    alt,
    caption,
    align,
    width,
    height,
}: ImageBlockType) {
    const imageRef = useRef<HTMLImageElement>(null);
    const [canZoom, setCanZoom] = useState(false);
    const [isEnlarged, setIsEnlarged] = useState(false);

    useEffect(() => {
        const image = imageRef.current;
        if (!image) return;

        const updateCanZoom = () => {
            setCanZoom(
                image.naturalWidth > image.clientWidth + 1 ||
                    image.naturalHeight > image.clientHeight + 1
            );
        };
        const observer = new ResizeObserver(updateCanZoom);
        observer.observe(image);
        updateCanZoom();

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isEnlarged) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsEnlarged(false);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isEnlarged]);

    return (
        <figure
            className={`${styles.figure} ${styles[align ?? 'none']}`}
            data-image-align={align ?? 'none'}
            style={{ width: width ?? undefined }}
        >
            {/* Native images support nullable migrated dimensions and resolved
                URLs from several remote hosts. The reset button preserves the
                existing appearance while enabling zoom for larger sources. */}
            <button
                className={`${styles.imageButton} ${canZoom ? styles.zoomable : ''}`}
                type="button"
                disabled={!canZoom}
                onClick={() => setIsEnlarged(true)}
                aria-label={canZoom ? `Enlarge ${alt ?? 'image'}` : undefined}
            >
                <img
                    ref={imageRef}
                    src={url}
                    alt={alt ?? ''}
                    width={width ?? undefined}
                    height={height ?? undefined}
                    onLoad={() => {
                        const image = imageRef.current;
                        if (image) {
                            setCanZoom(
                                image.naturalWidth > image.clientWidth + 1 ||
                                    image.naturalHeight > image.clientHeight + 1
                            );
                        }
                    }}
                />
            </button>

            {caption && <figcaption>{caption}</figcaption>}

            {isEnlarged && (
                <div
                    className={styles.lightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Enlarged image"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsEnlarged(false);
                        }
                    }}
                >
                    <button
                        className={styles.closeButton}
                        type="button"
                        onClick={() => setIsEnlarged(false)}
                        aria-label="Close enlarged image"
                    >
                        ×
                    </button>
                    <figure className={styles.enlargedFigure}>
                        <img
                            className={styles.enlargedImage}
                            src={url}
                            alt={alt ?? ''}
                        />
                        {caption && <figcaption>{caption}</figcaption>}
                    </figure>
                </div>
            )}
        </figure>
    );
}
