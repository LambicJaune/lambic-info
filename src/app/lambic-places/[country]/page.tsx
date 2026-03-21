import { placesMockData } from "../placesMockData";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import styles from "../PlacesPage.module.css";
import Link from "next/link";
import Image from "next/image";

export default async function CountryPlacesPage({ params }: { params: Promise<{ country: string }> }) {
    const { country } = await params;
    const countryData = placesMockData[country.toLowerCase()];
    if (!countryData) return <div>Country not found</div>;
    return (
        <>
            <GenericBanner backLink="/lambic-places" />
            <main className={styles.pageContainer}>
                <section className={styles.placesTitleBanner}>
                    <h1>{countryData.name}</h1>
                </section>
                <div className={styles.descriptionWrapper}>
                    <p>While there are many bars around the world that serve lambic, the list below represents places that feature lambic prominently.</p>
                </div>
                <div className={styles.placesGrid}>
                    {Object.entries(countryData.places).map(([slug, place]: [string, any]) => (
                        <Link href={`/lambic-places/${country}/${slug}`} key={slug} className={styles.placeCard}>
                            <div className={styles.placeImageWrapper}>
                                <Image 
                                    src="/images/shared/places_box.jpg"
                                    alt={place.name}
                                    fill
                                    className={styles.placeCardBg}
                                    priority
                                />
                                <div className={styles.placeOverlay}>
                                    <h3>{place.name}</h3>
                                    <p className={styles.cardSubtitle}>{place.city}</p>
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