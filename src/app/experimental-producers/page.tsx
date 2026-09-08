import Footer from '@/app/components/GenericFooter/GenericFooter';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import BlockRenderer from '@/app/components/blocks/BlockRenderer';
import { getExperimentalDirectory } from '@/lib/experimentalDirectory';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ExperimentalOverview.module.css';

export const dynamic = 'force-dynamic';

export default async function ExperimentalProducersOverview() {
    const { pages: producers, rows, introduction } = await getExperimentalDirectory();

    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.pageContainer}>
                <section><div className={styles.pageTitleBanner}><h1>Experimental Producers</h1></div></section>
                {introduction.length > 0 && <section className={styles.introduction}><BlockRenderer blocks={introduction} /></section>}
                <section className={styles.categoriesGrid}>
                    {producers.map((producer) => {
                        const name = producer.displayTitle ?? producer.title.replaceAll('_', ' ');
                        return (
                            <Link key={producer.slug} href={`/experimental-producers/${producer.slug}`} className={styles.categoryCard}>
                                <div className={styles.categoryImageWrapper}>
                                    <Image src="/images/shared/brewers_box.jpg" alt="" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                                </div>
                                <div className={styles.categoryOverlay}><h3>{name}</h3></div>
                            </Link>
                        );
                    })}
                </section>
                {rows.length > 0 && (
                    <section className={styles.directorySection}>
                        <h2>Complete List of Experimental Producers</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.directoryTable}>
                                <thead><tr><th>Name</th><th>Location</th><th>Active Dates</th><th>Overview</th></tr></thead>
                                <tbody>{rows.map((row, index) => <tr key={`${row.name}-${index}`}>
                                    <td>{row.slug ? <Link href={`/experimental-producers/${row.slug}`}>{row.name}</Link> : row.name}</td>
                                    <td>{row.location}</td><td>{row.activeDates}</td><td>{row.overview}</td>
                                </tr>)}</tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
