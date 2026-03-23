import Image from "next/image";
import { producersMockData } from "./mockData";
import styles from "./ExperimentalProducer.module.css";
import Link from "next/link";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import TextSection from "./sections/TextSection";
import { FaInstagram, FaFacebookF, FaGlobe, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";

export default async function ExperimentalProducers({ params }: { params: Promise<{ producer: string }> }) {
    const { producer } = await params;
    const producerKey = producer.toLowerCase();
    const producerData = producersMockData[producerKey];

    if (!producerData) return <div>Producer not found</div>;

    // Securedly extracting sections
    const overview = producerData.sections.find(s => s.title === "Overview" && s.type === "text");
    const history = producerData.sections.find(s => s.title === "History" && s.type === "text");

    const extraTexts = producerData.sections.filter(
        s => s.type === "text" && s.title !== "Overview" && s.title !== "History"
    );

    // FLATTEN BEER LISTS FOR THE TABLE
    const allBeers = Object.values(producerData.beerLists).flat();

    return (
        <>
            <GenericBanner backLink="/experimental-producers" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1>{producerData.name}</h1>
                </section>

                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>

                        {/* 1. SIDEBAR + BANNER */}
                        <div className={styles.mainTop}>
                            <aside className={styles.sidebar}>
                                <div className={styles.logoContainer}>
                                    <Image src={producerData.logo} alt="Logo" fill style={{ objectFit: "contain" }} priority />
                                </div>
                                <ul className={styles.breweryInfo}>
                                    {producerData.address && <li><FaMapMarkerAlt /> {producerData.address}</li>}
                                    {producerData.phone && <li><FaPhone /> {producerData.phone}</li>}
                                    {producerData.openingHours && <li><FaClock /> {producerData.openingHours}</li>}
                                </ul>
                                <div className={styles.socialLinks}>
                                    {producerData.website && (
                                        <a href={producerData.website} target="_blank" rel="noopener noreferrer">
                                            <FaGlobe />
                                        </a>
                                    )}
                                    {producerData.socials?.map((soc, i) => (
                                        <a key={i} href={soc.url} target="_blank" rel="noopener noreferrer">
                                            {soc.type === "instagram" ? <FaInstagram /> : <FaFacebookF />}
                                        </a>
                                    ))}
                                </div>
                            </aside>

                            {/* 2. BANNER IMAGE */}
                            <div className={styles.overviewBanner}>
                                <div className={styles.breweryBanner}>
                                    <Image src={producerData.banner} alt="Banner" fill style={{ objectFit: "cover" }} priority />
                                </div>
                            </div>
                        </div>

                        {/* 3. OVERVIEW TEXT */}
                        {overview && overview.type === "text" && (
                            <TextSection title={overview.title} content={overview.content} isAccordion={false} />
                        )}

                        {/* 4. HISTORY */}
                        {history && history.type === "text" && (
                            <TextSection title={history.title} content={history.content} isAccordion={true} />
                        )}

                        {/* 5. EXTRA TEXTS */}
                        {extraTexts.map((sec, i) => (
                            sec.type === "text" && (
                                <TextSection key={i} title={sec.title} content={sec.content} isAccordion={true} />
                            )
                        ))}

                        {/* ================= 6. BEER LIST TABLE (ACCORDION) ================= */}
                        {allBeers.length > 0 && (
                            <section className={styles.accordionSection}>
                                <details className={styles.accordionDetails}>
                                    <summary>
                                        <h2 className={styles.centeredTitle} style={{ display: 'inline-block', margin: 0 }}>
                                            Beer Portfolio
                                        </h2>
                                    </summary>

                                    <div className={styles.accordionContent}>
                                        <table className={styles.logTable}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Type</th>
                                                    <th>Bottling Date(s)</th>
                                                    <th>Bottle Count</th>
                                                    <th>Size</th>
                                                    <th>Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allBeers.map((beer, index) => (
                                                    <tr key={index}>
                                                        <td data-label="Name">
                                                            <Link
                                                                href={`/experimental-producers/${producerKey}/${beer.slug}`}
                                                                style={{ color: 'inherit', fontWeight: '600' }}
                                                            >
                                                                {beer.name}
                                                            </Link>
                                                        </td>
                                                        <td data-label="Type">{beer.type}</td>
                                                        <td data-label="Bottling Date">{beer.bottlingDate || "—"}</td>
                                                        <td data-label="Bottle Count">{beer.bottleCount || "—"}</td>
                                                        <td data-label="Size">{beer.size || "—"}</td>
                                                        <td data-label="Notes">{beer.notes || "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            </section>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}