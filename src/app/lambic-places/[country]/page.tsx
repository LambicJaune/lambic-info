import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import { getPlaceCountries } from '@/lib/placeDirectory';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '../PlacesPage.module.css';

export const dynamic = 'force-dynamic';

export default async function CountryPlacesPage({ params }: { params: Promise<{ country: string }> }) {
    const { country: requestedCountry } = await params;
    const countries = await getPlaceCountries();
    const country = countries.find((item) => item.slug === requestedCountry.toLowerCase());
    if (!country) notFound();

    return (
        <>
            <GenericBanner backLink="/lambic-places" />
            <main className={styles.pageContainer}>
                <section className={styles.placesTitleBanner}><h1>{country.name}</h1></section>
                <div className={styles.descriptionWrapper}>
                    <p>While there are many bars around the world that serve lambic, these places feature lambic prominently.</p>
                </div>
                <div className={styles.placesGrid}>
                    {country.places.map(({ page, name, city }) => (
                        <Link href={`/lambic-places/${country.slug}/${page.slug}`} key={page.slug} className={styles.placeCard}>
                            <div className={styles.placeImageWrapper}>
                                <Image src="/images/shared/places_box.jpg" alt="" fill className={styles.placeCardBg} />
                                <div className={styles.placeOverlay}>
                                    <h3>{name}</h3>
                                    {city && <p className={styles.cardSubtitle}>{city}</p>}
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
