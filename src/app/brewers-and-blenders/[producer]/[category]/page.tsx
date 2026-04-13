import { producersMockData } from "../mockData";
import styles from "../ProducerPage.module.css";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import Link from "next/link";

export default async function BeerListPage({ params }: { params: Promise<{ producer: string; category: string }> }) {
    const { producer, category } = await params;
    const producerKey = producer.toLowerCase();
    const categoryKey = category.toLowerCase();

    const producerData = producersMockData[producerKey];
    const beerList = producerData?.beerLists?.[categoryKey];

    if (!producerData || !beerList) {
        return (
            <>
                <GenericBanner backLink={`/brewers-and-blenders/${producer}`} />
                <main className={styles.pageContainer}>
                    <div style={{ textAlign: "center", padding: "10rem 2rem", color: "white" }}>
                        <h1 className={styles.centeredTitle}>List not found</h1>
                        <Link href={`/brewers-and-blenders/${producer}`} style={{ color: "#f1ca54", textDecoration: "underline" }}>
                            Return to {producerData?.name || "Producer"} Overview
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <GenericBanner />
            <main className={styles.pageContainer}>
                <section className={styles.categoriesTitleBanner}>
                    <h1>{producerData.name} - {category.replace(/-/g, ' ')}</h1>
                </section>

                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>

                        {/* Category specific description (e.g. Grape Lambic text) */}
                        {producerData.categoryDescriptions?.[categoryKey] && (
                            <p style={{
                                color: "#000000",
                                fontStyle: "italic",
                                textAlign: "center",
                                maxWidth: "900px",
                                margin: "0 auto 1rem auto",
                                lineHeight: "1.8",
                                fontSize: "1.3rem"
                            }}>
                                {producerData.categoryDescriptions[categoryKey]}
                            </p>
                        )}

                        <div className={styles.beerListGrid}>
                            {beerList.map((beer, i) => (
                                <div key={i} className={styles.beerItem}>
                                    {/* Wrap the name in a Link using beer.slug */}
                                    <Link href={`/brewers-and-blenders/${producer}/${category}/${beer.slug}`}>
                                        <h3 className={styles.beerName}>{beer.name}</h3>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}