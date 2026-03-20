import Image from "next/image";
import { producersMockData } from "./mockData";
import styles from "./ProducerPage.module.css";
import Link from "next/link";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import TextSection from "./sections/TextSection";
import ZwanzeSection from "./sections/ZwanzeSection";
import { FaInstagram, FaFacebookF, FaGlobe, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";

export default async function ProducerPage({ params }: { params: Promise<{ producer: string }> }) {
    const { producer } = await params;
    const producerKey = producer.toLowerCase();
    const producerData = producersMockData[producerKey];

    if (!producerData) return <div>Producer not found</div>;

    // Securedly extracting sections based on type and title to ensure correct rendering order and avoid duplicates
    const overview = producerData.sections.find(s => s.title === "Overview" && s.type === "text");
    const history = producerData.sections.find(s => s.title === "History" && s.type === "text");

    // Only filtering text sections that are not Overview or History for the extra texts section, to avoid duplicates
    const extraTexts = producerData.sections.filter(
        s => s.type === "text" && s.title !== "Overview" && s.title !== "History"
    );

    // Only filtering Zwanze sections for the special beer grid at the end
    const specialSections = producerData.sections.filter(s => s.type === "zwanze");

    return (
        <>
            <GenericBanner backLink="/brewers-and-blenders" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1>{producerData.name}</h1>
                </section>

                <div className={styles.pageContent}>
                    <div className={styles.contentWrapper}>

                        {/* 1. SIDEBAR + OVERVIEW */}
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

                            <div className={styles.overview}>
                                <div className={styles.breweryBanner}>
                                    <Image src={producerData.banner} alt="Banner" fill style={{ objectFit: "cover" }} priority />
                                </div>
                                {overview && overview.type === "text" && (
                                    <TextSection title={overview.title} content={overview.content} isAccordion={false} />
                                )}
                            </div>
                        </div>

                        {/* 2. HISTORY */}
                        {history && history.type === "text" && (
                            <TextSection title={history.title} content={history.content} isAccordion={true} />
                        )}

                        {/* 3. EXTRA TEXTS */}
                        {extraTexts.map((sec, i) => (
                            sec.type === "text" && (
                                <TextSection key={i} title={sec.title} content={sec.content} isAccordion={true} />
                            )
                        ))}

                        {/* 4. BEERS GRID */}
                        <section className={styles.section}>
                            <h2 className={styles.centeredTitle}>Beers</h2>
                            <div className={styles.categoriesGrid}>
                                {producerData.beerCategories.map((cat, i) => {
                                    // Create a URL-friendly slug for the category (e.g., "Fruit-lambic" -> "fruit-lambic")
                                    const categorySlug = cat.name.toLowerCase().replace(/\s+/g, '-');
                                    
                                    return (
                                        <Link 
                                            key={i} 
                                            href={`/brewers-and-blenders/${producer}/${categorySlug}`} 
                                            className={styles.categoryCard}
                                        >
                                            <Image 
                                                src={cat.image} 
                                                alt={cat.name} 
                                                fill 
                                                style={{ objectFit: "cover" }} 
                                            />
                                            <div className={styles.categoryOverlay}>
                                                <h3>{cat.name}</h3>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>

                        {/* 5. ZWANZE */}
                        {specialSections.map((sec, i) => (
                            sec.type === "zwanze" && (
                                <ZwanzeSection key={i} title={sec.title} description={sec.description} subTitle={sec.subTitle} beers={sec.beers} />
                            )
                        ))}

                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}