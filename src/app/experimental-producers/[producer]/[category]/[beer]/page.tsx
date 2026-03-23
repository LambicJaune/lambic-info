import { producersMockData } from "../../mockData";
import styles from "../../ProducerPage.module.css";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import Image from "next/image";
import Link from "next/link";

export default async function BeerDetailPage({ params }: { params: Promise<{ producer: string; category: string; beer: string }> }) {
    const { producer, category, beer } = await params;
    const producerData = producersMockData[producer.toLowerCase()];
    const beerData = producerData?.beerDetails?.[beer.toLowerCase()];

    if (!beerData) {
        return (
            <>
                <GenericBanner backLink={`/brewers-and-blenders/${producer}/${category}`} />
                <main className={styles.pageContainer}>
                    <div style={{ textAlign: "center", padding: "10rem 2rem", color: "black" }}>
                        <h1 className={styles.centeredTitle}>Beer Details Coming Soon</h1>
                        <p style={{ marginBottom: "2rem" }}>We are currently gathering historical data for {beer.replace(/-/g, ' ')}.</p>
                        <Link href={`/brewers-and-blenders/${producer}/${category}`} style={{ color: "#f1ca54", textShadow: "2px 2px 1px rgba(0,0,0,0.7)", textDecoration: "underline", fontSize: "1.3em" }}>
                            Return to {category.replace(/-/g, ' ')} list
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
                    <h1 style={{ textTransform: 'none' }}>{producerData.name} {beerData.name}</h1>
                </section>

                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>

                        {/* Top Section: Description & Label */}
                        <section className={styles.section} style={{ overflow: "hidden", marginBottom: "4rem" }}>
                            <div style={{ float: "right", marginLeft: "2.5rem", marginBottom: "1.5rem", maxWidth: "350px", width: "100%" }}>
                                <Image
                                    src={beerData.labelImage}
                                    alt={`${beerData.name} label`}
                                    width={350}
                                    height={450}
                                    className={styles.labelImage}
                                    priority
                                />
                            </div>
                            <h2 style={{ textAlign: "left", color: "#000", borderBottom: "2px solid #000", paddingBottom: "0.5rem" }}>Description</h2>
                            <p style={{ color: "#000", fontSize: "1.4rem", textAlign: "justify", whiteSpace: "pre-line" }}>{beerData.description}</p>
                        </section>

                        {/* Dynamic Sections (History, Notes, etc) */}
                        {beerData.sections.map((sec, i) => (
                            <section key={i} className={styles.section} style={{ marginBottom: "3rem" }}>
                                <h2 style={{ textAlign: "left", color: "#000", borderBottom: "2px solid #000", paddingBottom: "0.5rem" }}>{sec.title}</h2>
                                <p style={{ color: "#000", fontSize: "1.4rem", textAlign: "justify", whiteSpace: "pre-line" }}>{sec.content}</p>
                            </section>
                        ))}

                        {/* Bottle Log Accordion Section */}
                        <section className={styles.section} style={{ marginTop: "5rem" }}>
                            <details className={styles.accordionDetails}>
                                <summary style={{ cursor: "pointer", listStyle: "none" }}>
                                    <h2 className={styles.centeredTitle} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        Bottle Log
                                    </h2>
                                </summary>
                                <div style={{ overflowX: "auto", marginTop: "2rem" }}>
                                    <table className={styles.logTable}>
                                        <thead>
                                            <tr>
                                                <th>Bottling Date</th>
                                                <th>Season</th>
                                                <th>Bottle Count</th>
                                                <th>Size</th>
                                                <th>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {beerData.bottleLog
                                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                                .map((entry) => (
                                                    <tr key={entry.id}>
                                                        <td>{entry.date}</td>
                                                        <td>{entry.season}</td>
                                                        <td>{entry.bottleCount || "—"}</td>
                                                        <td>{entry.size}</td>
                                                        <td>{entry.notes}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </details>
                        </section>

                        {/* References Section */}
                        {beerData.references && (
                            <section style={{ marginTop: "4rem", paddingTop: "2rem" }}>
                                <h3 style={{ color: "#000", marginBottom: "1rem" }}>References:</h3>
                                <ul style={{ color: "#555", fontSize: "1.2rem" }}>
                                    {beerData.references.map((ref, i) => <li key={i}>{ref}</li>)}
                                </ul>
                            </section>
                        )}

                        {/* Back Navigation */}
                        <div style={{ textAlign: "center", marginTop: "5rem", paddingBottom: "4rem" }}>
                            <Link href={`/brewers-and-blenders/${producer}/${category}`} className={styles.centeredTitle} style={{ fontSize: "1.5rem" }}>
                                ← Back to the {category.replace(/-/g, ' ') } list
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}