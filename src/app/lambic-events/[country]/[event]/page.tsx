"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { EventsMockData } from "../../EventsMockData";
import styles from "../../EventsPage.module.css";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";

export default function EventDetailPage({ params }: { params: Promise<{ country: string, event: string }> }) {
    const { country, event } = use(params);
    const countryKey = country.toLowerCase();
    const eventKey = event.toLowerCase();

    const countryData = EventsMockData[countryKey];
    const eventData = countryData?.events[eventKey];

    if (!eventData) return notFound();

    const getStatusClass = (status: string) => {
        if (status === "Active") return styles.statusActive;
        if (status === "On Hiatus") return styles.statusOnHiatus;
        return styles.statusNotOccuringAnymore;
    };

    return (
        <>
            <GenericBanner backLink={`/lambic-events/${countryKey}`} />

            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1 className={styles.noTransform}>{eventData.name}</h1>
                </section>

                <div className={styles.eventContent}>
                    <div className={styles.eventContentWrapper}>

                        {/* HORIZONTAL INFO BAR */}
                        <div className={styles.eventInfoBar}>
                            <div className={styles.eventMetaItem}>
                                <span className={styles.metaLabel}>Date / Timing</span>
                                <span className={styles.metaValue}>{eventData.date}</span>
                            </div>
                            <div className={styles.eventMetaItem}>
                                <span className={styles.metaLabel}>Frequency</span>
                                <span className={styles.metaValue}>{eventData.frequency}</span>
                            </div>
                            <div className={styles.eventMetaItem}>
                                <span className={styles.metaLabel}>Next Date</span>
                                <span className={styles.metaValue}>{eventData.nextOccurrence}</span>
                            </div>
                            <div className={styles.eventMetaItem}>
                                <span className={styles.metaLabel}>Current Status</span>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <span className={`${styles.statusBadge} ${getStatusClass(eventData.status)}`}>
                                        {eventData.status}
                                    </span>
                                </div>
                            </div>
                            {eventData.website && (
                                <div className={styles.eventMetaItem}>
                                    <span className={styles.metaLabel}>Official Link</span>
                                    <a href={eventData.website} target="_blank" rel="noopener noreferrer"
                                        style={{ color: '#000', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1.1rem' }}>
                                        Website →
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* OVERVIEW SECTION */}
                        <section className={styles.eventSection}>
                            <div className={styles.floatingImageWrapper}>
                                <Image
                                    src={eventData.image}
                                    alt={eventData.name}
                                    width={480}
                                    height={600}
                                    className={styles.eventLabelImage}
                                    priority
                                />
                            </div>
                            <h2>Overview</h2>
                            <p>{eventData.overview}</p>
                        </section>

                        {/* HISTORY SECTION */}
                        {eventData.history && (
                            <section className={styles.eventSection}>
                                <h2>History</h2>
                                <p>{eventData.history}</p>
                            </section>
                        )}

                        {/* EVENT ARCHIVE ACCORDION */}
                        {eventData.zwanzeHistory && (
                            <section className={styles.accordionSection}>
                                <details className={styles.accordionDetails}>
                                    <summary>
                                        <h2 className={styles.centeredTitle}>Event Archives</h2>
                                    </summary>
                                    <table className={styles.logTable}>
                                        <thead>
                                            <tr>
                                                <th>Year</th>
                                                <th>Theme / Selection</th>
                                                <th>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {eventData.zwanzeHistory.map((row, i) => (
                                                <tr key={i}>
                                                    <td data-label="Year" style={{ fontWeight: 'bold' }}>{row.year}</td>
                                                    <td data-label="Theme">{row.theme}</td>
                                                    <td data-label="Details">{row.locations}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </details>
                            </section>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}