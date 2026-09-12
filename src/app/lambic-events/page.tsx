import Link from "next/link";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import { getEventCountries } from "@/lib/eventDirectory";
import styles from "./EventsPage.module.css";

export const dynamic = "force-dynamic";

export default async function LambicEventsCountriesPage() {
    const countries = await getEventCountries();
    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1>Lambic Events</h1>
                </section>
                <div className={styles.eventsGrid}>
                    {countries.map((country) => (
                        <Link href={`/lambic-events/${country.slug}`} key={country.slug} className={styles.countryCard}>
                            <div className={styles.eventImageWrapper}>
                                <img src="/images/shared/worldwide.png" alt="" className={styles.cardFlag} />
                                <div className={styles.eventOverlay}>
                                    <h2>{country.name}</h2>
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
