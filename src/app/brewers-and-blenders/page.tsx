"use client";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/GenericFooter";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import styles from "./BrewersOverview.module.css";

const brewers = [
    "3 Fonteinen", "4Pajot", "Ambreus", "Angerik", "Belle Vue", "Bobbi",
    "Boerenerf", "Bofkont", "Bokke", "Boon", "Cantillon", "Dansaert",
    "De Cam", "De Cort", "De Troch", "Den Herberg", "Donck", "Donder",
    "DUST", "Eylenbosch", "Girardin", "Hanssens", "Kestemont",
    "Lambiek Fabriek", "Lindemans", "Mort Subite", "Odilon", "Oud Beersel",
    "Parrain", "Pellicle Vergistingen", "Publitasting", "Sako", "Taymans",
    "Tilquin", "Timmermans", "Van Aert", "Vermeersch", "WOFD"
];

export default function BrewersOverview() {
    return (
        <>
            <GenericBanner />
            <main className={styles.main}>
                <section className={styles.categoriesGrid}>
                    {brewers.map((brewery) => {
                        // Special link for Cantillon to go to the dynamic producer page
                        const href =
                            brewery === "Cantillon"
                                ? `/brewers-and-blenders/cantillon`
                                : `#`; // keep others static for now, or link to future pages

                        return (
                            <Link key={brewery} href={href} className={styles.categoryCard}>
                                <div className={styles.categoryImageWrapper}>
                                    <Image
                                        src="/images/brewers-and-blenders/brewers_box.jpg"
                                        alt={brewery}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                        priority
                                    />
                                </div>

                                <div className={styles.categoryOverlay}>
                                    <h3>{brewery}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </main>

            <Footer />
        </>
    );
}