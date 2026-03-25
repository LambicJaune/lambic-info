"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import { producersMockData } from "@/app/closed-producers/[producer]/mockData";
import styles from "./ClosedProducersOverview.module.css";

export default function ClosedProducersOverview() {
    const data = producersMockData["closed-producers"];
    const beerLists = data.beerLists;

    return (
        <>
            <GenericBanner backLink="/" />

            <main className={styles.main}>
                {/* 1. Main Page Title with Paint Stroke */}
                <div className={styles.pageTitleBanner}>
                    <h1>Closed Producers</h1>
                </div>

                {/* 2. Intro Text */}
                <section className={styles.descriptionSection}>
                    {data.sections.map((sec, i) => (
                        <div key={i}>
                            {sec.type === "text" && (
                                <div className={styles.richText}>
                                    {sec.content.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* 3. Grid Section */}
                <h2 className={styles.centeredTitle}>
                    Closed Lambic Brewers & Blenders Pages
                </h2>

                <section className={styles.categoriesGrid}>
                    {Object.values(beerLists).flat().map((producer) => (
                        <Link
                            key={producer.slug}
                            href={`/closed-producers/${producer.slug}`}
                            className={styles.categoryCard}
                        >
                            <div className={styles.categoryImageWrapper}>
                                <Image
                                    src="/images/shared/brewers_box.jpg"
                                    alt={producer.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                />
                            </div>
                            <div className={styles.categoryOverlay}>
                                <h3>{producer.name}</h3>
                            </div>
                        </Link>
                    ))}
                </section>

                {/* 4. Directory Section */}
                <section className={styles.directorySection}>
                    <h2 className={styles.centeredTitle}>Complete List of Closed Lambic Breweries and Blenders</h2>

                    {Object.keys(beerLists).sort().map((letter) => (
                        <details key={letter} className={styles.accordionDetails}>
                            <summary>
                                {letter}
                            </summary>

                            <div className={styles.tableWrapper}>
                                <table className={styles.logTable}>
                                    <thead>
                                        <tr>
                                            <th>Brewery / Blender</th>
                                            <th>Location</th>
                                            <th>Dates Active</th>
                                            <th>Notes / Links</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {beerLists[letter].map((item, idx) => (
                                            <tr key={idx}>
                                                <td data-label="Brewery">{item.name}</td>
                                                <td data-label="Location">{item.location || "—"}</td>
                                                <td data-label="Dates">{item.dates || "—"}</td>
                                                <td data-label="Notes">{item.notes || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    ))}
                </section>
            </main>

            <Footer />
        </>
    );
}