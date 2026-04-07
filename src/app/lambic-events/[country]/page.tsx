import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import styles from "../EventsPage.module.css"; 
import { EventsMockData } from "../EventsMockData";

export default async function CountryEventsPage({ params }: { params: Promise<{ country: string }> }) {
    const { country } = await params;
    const countryData = EventsMockData[country.toLowerCase()];

    if (!countryData) return notFound();

    const getStatusClass = (status: string) => {
        if (status === "Active") return styles.statusActive;
        if (status === "On Hiatus") return styles.statusOnHiatus;
        return styles.statusNotOccuringAnymore;
    };

    return (
        <>
            <GenericBanner backLink="/lambic-events" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1 className={styles.noTransform}>{countryData.countryName} Events</h1>
                </section>
                <div className={styles.eventsGrid}>
                    {Object.entries(countryData.events).map(([slug, event]) => (
                        <Link href={`/lambic-events/${country}/${slug}`} key={slug} className={styles.eventCard}>
                            <div className={styles.eventImageWrapper}>
                                <div className={styles.eventOverlay}>
                                    <h3>{event.name}</h3>
                                    <span className={styles.cardSubtitle}>{event.date}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}