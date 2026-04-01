// src/app/info/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { mockData } from './mockData';
import styles from './InfoPage.module.css';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import GenericBanner from '@/app/components/GenericBanner/GenericBanner';
import Footer from '@/app/components/GenericFooter/GenericFooter';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function InfoPage({ params }: Props) {
    // Await the params to "unwrap" the slug
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const data = mockData[slug];

    if (!data) {
        notFound();
    }

    return (
        <>
            <GenericBanner backLink="/" />
            <main className={styles.mainWrapper}>
                <h1 className={styles.pageTitle}>{data.title}</h1>

                {data.sections.map((section, index) => (
                    <section key={index} className={styles.sectionBlock}>

                        {/* 1. Layout: Text Only */}
                        {section.type === 'text-only' && section.content && (
                            <div className={styles.paragraph}>
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        )}

                        {/* 2. Layout: Split (Text + Image) */}
                        {section.type === 'split' && (
                            <div className={`${styles.splitGrid} ${section.imageSide === 'left' ? styles.reverse : ''}`}>
                                <div className={styles.textColumn}>
                                    {section.title && <h2>{section.title}</h2>}
                                    <ReactMarkdown
                                        components={{
                                            a: ({ href, children }) => (
                                                <Link href={href || '#'} className={styles.inlineLink}>{children}</Link>
                                            ),
                                        }}
                                    >
                                        {section.content || ''}
                                    </ReactMarkdown>
                                </div>
                                <div className={styles.imageColumn}>
                                    <img src={section.image} alt={section.title || "Section image"} />
                                </div>
                            </div>
                        )}

                        {/* 3. Layout: Glossary */}
                        {section.type === 'glossary' && (
                            <div className={styles.glossaryWrapper}>

                                {/* --- ADD THIS: The Navigation Bar --- */}
                                <nav className={styles.alphabetNav}>
                                    {section.alphabet?.map((group, i) => (
                                        <a key={i} href={`#letter-${group.letter}`} className={styles.navLink}>
                                            {group.letter}
                                        </a>
                                    ))}
                                </nav>

                                {/* The Accordions */}
                                {section.alphabet?.map((group, i) => (
                                    <details key={i} id={`letter-${group.letter}`} className={styles.letterAccordion}>
                                        <summary className={styles.letterHeader}>
                                            {group.letter}
                                            <span className={styles.plusIcon}>+</span>
                                        </summary>
                                        <ul className={styles.entryList}>
                                            {group.entries.map((entry, j) => (
                                                <li key={j} className={styles.entryItem}>
                                                    <strong className={styles.word}>{entry.word}:</strong>
                                                    <span className={styles.definition}> {entry.definition}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                ))}
                            </div>
                        )}
                        
                    </section>
                ))}
            </main>
            <Footer />
        </>
    );
}