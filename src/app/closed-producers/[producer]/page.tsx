"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import { producersMockData } from "../[producer]/mockData";
import styles from "./ClosedProducerPage.module.css";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import { FaMapMarkerAlt, FaPhone, FaImages, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiHourglass } from "react-icons/gi";

export default function ClosedProducerPage({ params }: { params: Promise<{ producer: string }> }) {
    const { producer } = use(params);
    const producerSlug = producer.toLowerCase();

    const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
    const [currentImgIdx, setCurrentImgIdx] = useState<number>(0);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxImages(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const closedData = producersMockData["closed-producers"];
    let producerData: any = null;
    Object.values(closedData.beerLists).forEach((letterGroup: any) => {
        const found = letterGroup.find((p: any) => p.slug === producerSlug);
        if (found) producerData = found;
    });

    if (!producerData) return <div className={styles.error}>Producer not found</div>;

    const openLightbox = (images: string[], index: number = 0) => {
        setLightboxImages(images);
        setCurrentImgIdx(index);
    };

    // Separate References so they are displayed at the end
    const mainSections = producerData.sections?.filter((s: any) => s.title !== "References") || [];
    const referenceSection = producerData.sections?.find((s: any) => s.title === "References");
    const gallery = producerData.gallery || [];

    return (
        <>
            <GenericBanner backLink="/closed-producers" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1 className={styles.noTransform}>{producerData.name}</h1>
                </section>

                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>
                        {/* 1. META INFO */}
                        <div className={styles.infoBar}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}><FaMapMarkerAlt /> Location</span>
                                <span className={styles.metaValue}>{producerData.location || "Unknown"}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}><GiHourglass /> Active Dates</span>
                                <span className={styles.metaValue}>{producerData.dates || "N/A"}</span>
                            </div>
                            {producerData.phone && (
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}><FaPhone /> Phone</span>
                                    <span className={styles.metaValue}>{producerData.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* 2. MAIN CONTENT SECTIONS (In DB Order, excluding References) */}
                        {mainSections.map((section: any, sIdx: number) => {
                            if (section.title === "History") {
                                return (
                                    <section key={sIdx} className={styles.historySection}>
                                        <div className={styles.floatingImageWrapper}>
                                            <Image
                                                src={producerData.logo || "/images/shared/brewers_box.jpg"}
                                                alt={producerData.name}
                                                width={400}
                                                height={400}
                                                className={styles.historicalImage}
                                                priority
                                            />
                                        </div>
                                        <h2 className={styles.sectionTitle}>History</h2>
                                        <div className={styles.richText}>
                                            {section.content.split('\n\n').map((p: string, i: number) => (
                                                <p key={i}>{p}</p>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }

                            if (section.type === "text") {
                                return (
                                    <section key={sIdx} className={styles.historySection}>
                                        <h2 className={styles.sectionTitle}>{section.title}</h2>
                                        <div className={styles.richText}>
                                            {section.content.split('\n\n').map((p: string, j: number) => (
                                                <p key={j}>{p}</p>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }
                            return null;
                        })}

                        {/* 3. BEER PORTFOLIO */}
                        {producerData.beerPortfolio && (
                            <section className={styles.accordionSection}>
                                <details className={styles.accordionDetails}>
                                    <summary>
                                        <h2 className={styles.centeredTitle}>Beer Portfolio</h2>
                                    </summary>
                                    <table className={styles.logTable}>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Notes</th>
                                                <th>Label(s)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {producerData.beerPortfolio.map((beer: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td data-label="Name" className={styles.boldCell}>{beer.name}</td>
                                                    <td data-label="Type">{beer.type}</td>
                                                    <td data-label="Notes">{beer.notes}</td>
                                                    <td data-label="Labels" className={styles.imageCell}>
                                                        {beer.images?.length > 0 ? (
                                                            <div
                                                                className={`${styles.thumbnailContainer} ${styles.clickableThumb}`}
                                                                onClick={(e) => { e.stopPropagation(); openLightbox(beer.images); }}
                                                            >
                                                                <Image src={beer.images[0]} alt={beer.name} width={100} height={75} className={styles.tableThumb} />
                                                                {beer.images.length > 1 && (
                                                                    <div className={styles.imageStackCounter}>
                                                                        <FaImages /> <span>+{beer.images.length - 1}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : <span className={styles.noImageText}>No image</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </details>
                            </section>
                        )}

                        {/* 4. GALLERY */}
                        {gallery.length > 0 && (
                            <section className={styles.accordionSection}>
                                <h2 className={styles.sectionTitle}>Gallery</h2>
                                <div className={styles.galleryGrid}>
                                    {gallery.map((album: any, aIdx: number) => (
                                        <div key={aIdx} className={styles.albumWrapper}>
                                            <h3 className={styles.albumTitle}>{album.title}</h3>
                                            <div className={styles.albumGrid}>
                                                {album.images.map((img: string, iIdx: number) => (
                                                    <div key={iIdx} className={styles.galleryThumb} onClick={() => openLightbox(album.images, iIdx)}>
                                                        <Image src={img} alt={`${album.title} ${iIdx}`} width={200} height={150} style={{ objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 5. REFERENCES */}
                        {referenceSection && (
                            <div className={styles.references}>
                                <h4>References</h4>
                                <p>{referenceSection.content}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* LIGHTBOX */}
            {lightboxImages && (
                <div className={styles.lightboxOverlay} onClick={() => setLightboxImages(null)}>
                    <button className={styles.closeBtn} onClick={() => setLightboxImages(null)}><FaTimes /></button>
                    {lightboxImages.length > 1 && (
                        <>
                            <button className={styles.navBtnPrev} onClick={(e) => { e.stopPropagation(); setCurrentImgIdx((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1)); }}>
                                <FaChevronLeft />
                            </button>
                            <button className={styles.navBtnNext} onClick={(e) => { e.stopPropagation(); setCurrentImgIdx((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1)); }}>
                                <FaChevronRight />
                            </button>
                        </>
                    )}
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <Image src={lightboxImages[currentImgIdx]} alt="Zoomed" width={1200} height={800} style={{ objectFit: 'contain', width: '100%', height: 'auto' }} />
                        <p className={styles.imgCounter}>{currentImgIdx + 1} / {lightboxImages.length}</p>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}