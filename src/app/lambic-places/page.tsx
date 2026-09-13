import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPlaceCountries } from '@/lib/placeDirectory';
import Link from 'next/link';
import styles from './PlacesPage.module.css';

export const dynamic = 'force-dynamic';

export default async function LambicPlacesPage() {
    const countries = await getPlaceCountries();

    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                <section className={styles.placesTitleBanner}>
                    <h1>Lambic Places</h1>
                </section>
                <div className={styles.placesGrid}>
                    {countries.map((country) => (
                        <Link href={`/lambic-places/${country.slug}`} key={country.slug} className={`${styles.placeCard} ${styles.countryCard}`}>
                            <div className={styles.placeImageWrapper}>
                                <img src="/images/shared/worldwide.png" alt="" className={styles.cardFlag} />
                                <div className={styles.placeOverlay}>
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
