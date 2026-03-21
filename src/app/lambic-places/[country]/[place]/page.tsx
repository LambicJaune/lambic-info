import { placesMockData } from "../../placesMockData";
import styles from "../../PlacesPage.module.css";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import Image from "next/image";
import TextSection from "@/app/brewers-and-blenders/[producer]/sections/TextSection";
import { FaInstagram, FaFacebookF, FaGlobe, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";

export default async function PlaceDetailPage({ params }: { params: Promise<{ country: string, place: string }> }) {
    const { country, place } = await params;
    const countryData = placesMockData[country.toLowerCase()];
    const placeData = countryData?.places[place];

    if (!placeData) return <div>Place not found</div>;

    const addresses = Array.isArray(placeData.address) ? placeData.address : [placeData.address];
    const phones = Array.isArray(placeData.phone) ? placeData.phone : [placeData.phone];

    return (
        <>
            <GenericBanner backLink={`/lambic-places/${country}`} />
            <main className={styles.pageContainer}>
                <section className={styles.placesTitleBanner}>
                    <h1 className={styles.noTransform}>{placeData.name}</h1>
                </section>

                <div className={styles.placeContentWrapper}>
                    <div className={styles.placeInnerContainer}>
                        <div className={styles.placeTopFlex}>
                            <aside className={styles.placeSidebar}>
                                <div className={styles.placeLogoWrapper}>
                                    <Image
                                        src={placeData.logo || placeData.image}
                                        alt={`${placeData.name} logo`}
                                        fill
                                        style={{ objectFit: "contain" }} // Use contain so logos aren't cropped!
                                        priority
                                    />
                                </div>

                                <div className={styles.placeInfoContainer}>
                                    {/* LOOP BY INDEX TO KEEP PAIRS TOGETHER */}
                                    {addresses.map((addr: string, i: number) => (
                                        <div key={`contact-group-${i}`} className={styles.contactGroup}>
                                            <div className={styles.infoLine}>
                                                <FaMapMarkerAlt /> <span>{addr}</span>
                                            </div>
                                            {phones[i] && (
                                                <div className={styles.infoLine}>
                                                    <FaPhone /> <span>{phones[i]}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* OPENING HOURS */}
                                    {placeData.openingHours && (
                                        <div className={styles.infoLine}>
                                            <FaClock />
                                            <div className={styles.hoursList}>
                                                {placeData.openingHours.split('\n').map((line: string, idx: number) => (
                                                    <div key={idx}>{line}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* SOCIAL MEDIA */}
                                    <div className={styles.socialWrapper}>
                                        {placeData.website && <a href={placeData.website} target="_blank" className={styles.socialLink}><FaGlobe /></a>}
                                        {placeData.instagram && <a href={placeData.instagram} target="_blank" className={styles.socialLink}><FaInstagram /></a>}
                                        {placeData.facebook && <a href={placeData.facebook} target="_blank" className={styles.socialLink}><FaFacebookF /></a>}
                                    </div>
                                </div>
                            </aside>

                            <div className={styles.placeMainText}>
                                <div className={styles.placeHeroBanner}>
                                    <Image
                                        src={placeData.image}
                                        alt="Banner"
                                        fill
                                        className={styles.placeCardBg}
                                        priority
                                    />
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <TextSection title="Overview" content={placeData.overview} isAccordion={false} />
                                </div>
                            </div>
                        </div>

                        {placeData.history && (
                            <TextSection title="History" content={placeData.history} isAccordion={true} />
                        )}

                        {placeData.sections?.map((sec: any, i: number) => (
                            <TextSection key={i} title={sec.title} content={sec.content} isAccordion={true} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}