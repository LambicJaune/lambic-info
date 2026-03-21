import Link from "next/link";
import Image from "next/image";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import styles from "./PlacesPage.module.css";
import { placesMockData } from "./placesMockData";

export default function LambicPlacesPage() {
    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                <section className={styles.placesTitleBanner}>
                    <h1>Lambic Places</h1>
                </section>
                <div className={styles.placesGrid}>
                    {Object.entries(placesMockData).map(([slug, country]: [string, any]) => (
                        <Link href={`/lambic-places/${slug}`} key={slug} className={styles.placeCard}>
                            <div className={styles.placeImageWrapper}>
                                <Image 
                                    src="/images/shared/brewers_box.jpg"
                                    alt={country.name}
                                    fill
                                    className={styles.placeCardBg}
                                    priority
                                />
                                <div className={styles.placeOverlay}>
                                    <h2>{country.name}</h2>
                                    <img src={country.flagIcon} alt="flag" className={styles.cardFlag} />
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