"use client";
import Image from "next/image";
import styles from "@/app/brewers-and-blenders/[producer]/ProducerPage.module.css";

interface Beer {
    id: number;
    name: string;
    img: string;
}

interface Props {
    title: string;
    description?: string;
    subTitle?: string;
    beers: Beer[];
}

export default function ZwanzeSection({ title, description, subTitle, beers }: Props) {
    return (
        <section className={styles.section}>
            <h2 className={styles.centeredTitle}>{title}</h2>
            {description && (
                <div className={styles.sectionDescription}>
                    <p>{description}</p>
                </div>
            )}
            {subTitle && <h2>{subTitle}</h2>}
            <div className={styles.zwanzeGrid}>
                {beers.map((beer) => (
                    <div key={beer.id} className={styles.zwanzeButton}>
                        {/* Isolated Image Container */}
                        <div className={styles.zwanzeImageWrapper}>
                            <Image
                                src={beer.img}
                                alt={beer.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                style={{ objectFit: "cover" }}
                            />
                        </div>

                        {/* Overlay */}
                        <div className={styles.zwanzeOverlay}>
                            <h3>{beer.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}