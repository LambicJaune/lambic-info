"use client";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import styles from "./ExperimentalOverview.module.css";

// IMPORT FIX: Import 'producersMockData' (the actual object) 
// instead of just the 'ProducerData' type.
import { producersMockData } from "./[producer]/mockData"; 

export default function ExperimentalProducersOverview() {
    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                <section>
                    <div className={styles.pageTitleBanner}>
                        <h1>Experimental Producers</h1>
                    </div>
                </section>
                <section className={styles.categoriesGrid}>
                    {/* We use Object.entries to get the key (biir, h-ertie, etc.) 
                      as the 'slug' for the URL, and the value as 'producer' 
                    */}
                    {Object.entries(producersMockData).map(([slug, producer]) => (
                        <Link 
                            key={slug} 
                            href={`/experimental-producers/${slug}`} 
                            className={styles.categoryCard}
                        >
                            <div className={styles.categoryImageWrapper}>
                                <Image
                                    src="/images/shared/brewers_box.jpg"
                                    alt={producer.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                    priority
                                />
                            </div>

                            <div className={styles.categoryOverlay}>
                                <h3>{producer.name}</h3>
                            </div>
                        </Link>
                    ))}
                </section>
            </main>

            <Footer />
        </>
    );
}