import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/GenericFooter/GenericFooter";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import { getPagesByType } from "@/lib/pages";
import styles from "./BrewersOverview.module.css";

export const dynamic = "force-dynamic";

export default async function BrewersOverview() {
    const brewers = (await getPagesByType("brewer-or-blender"))
        // Temporary backend deduplication: Bokke, Het Boerenerf, and WOFD are authoritative.
        .filter((page) => !["bokkereyder", "boerenerf", "w-o-f-d-vergistingen"].includes(page.slug))
        .sort(compareProducerNames);

    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                <section className={styles.pageTitleBanner}>
                    <h1>Brewers and Blenders</h1>
                </section>
                <section className={styles.categoriesGrid}>
                    {brewers.map((brewery) => {
                        const name = brewery.displayTitle ?? brewery.title.replaceAll("_", " ");
                        const [primaryName, qualifier] = splitCardTitle(name);

                        return (
                            <Link key={brewery.slug} href={`/brewers-and-blenders/${brewery.slug}`} className={styles.categoryCard}>
                                <div className={styles.categoryImageWrapper}>
                                    <Image
                                        src="/images/shared/brewers_box.jpg"
                                        alt=""
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                        priority
                                    />
                                </div>

                                <div className={styles.categoryOverlay}>
                                    <h3>
                                        <span>{primaryName}</span>
                                        {qualifier && <span className={styles.cardQualifier}>{qualifier}</span>}
                                    </h3>
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

function splitCardTitle(name: string): [string, string | null] {
    const parenthetical = name.match(/^(.*?)\s+(\([^()]+\))$/);
    if (parenthetical) return [parenthetical[1], parenthetical[2]];

    if (name.length >= 27) {
        const lastSpace = name.lastIndexOf(" ");
        if (lastSpace > 0) return [name.slice(0, lastSpace), name.slice(lastSpace + 1)];
    }

    return [name, null];
}

function compareProducerNames(a: Awaited<ReturnType<typeof getPagesByType>>[number], b: Awaited<ReturnType<typeof getPagesByType>>[number]): number {
    const aName = a.displayTitle ?? a.title.replaceAll("_", " ");
    const bName = b.displayTitle ?? b.title.replaceAll("_", " ");
    const aStartsWithNumber = /^\d/.test(aName);
    const bStartsWithNumber = /^\d/.test(bName);
    if (aStartsWithNumber !== bStartsWithNumber) return aStartsWithNumber ? -1 : 1;
    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: "base" });
}
