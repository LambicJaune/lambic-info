import Link from "next/link";
import Image from "next/image";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import styles from "./EventsPage.module.css";
import { EventsMockData } from "./EventsMockData";

export default function LambicEventsCountriesPage() {
    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                <section className={styles.eventTitleBanner}>
                    <h1>Lambic Events</h1>
                </section>
                <div className={styles.eventsGrid}>
                    {Object.entries(EventsMockData).map(([slug, country]) => (
                        <Link href={`/lambic-events/${slug}`} key={slug} className={styles.countryCard}>
                            <div className={styles.eventImageWrapper}>
                                <img src={country.flagIcon} alt="flag" className={styles.cardFlag} />
                                <div className={styles.eventOverlay}>
                                    <h2>{country.countryName}</h2>
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