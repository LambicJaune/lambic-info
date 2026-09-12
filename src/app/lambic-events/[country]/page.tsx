import Link from "next/link";
import { notFound } from "next/navigation";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import styles from "../EventsPage.module.css"; 
import { getEventCountries } from "@/lib/eventDirectory";

export const dynamic = "force-dynamic";

export default async function CountryEventsPage({ params }: { params: Promise<{ country: string }> }) {
    const { country } = await params;
    const countries = await getEventCountries();
    const countryData = countries.find((item) => item.slug === country.toLowerCase());

    if (!countryData) return notFound();

    return (
        <>
            <GenericBanner backLink="/lambic-events" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1 className={styles.noTransform}>{countryData.name} Events</h1>
                </section>
                <div className={styles.eventsGrid}>
                    {countryData.events.map(({ page, name }) => (
                        <Link href={`/lambic-events/${countryData.slug}/${page.slug}`} key={page.slug} className={styles.eventCard}>
                            <div className={styles.eventImageWrapper}>
                                <div className={styles.eventOverlay}>
                                    <h3>{name}</h3>
                                    {page.address && <span className={styles.cardSubtitle}>{page.address}</span>}
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
