"use client";
import styles from "@/app/experimental-producers/[producer]/ExperimentalProducer.module.css";

interface Props {
    title: string;
    content: string;
    isAccordion?: boolean;
}

export default function TextSection({ title, content, isAccordion = true }: Props) {
    const contentRender = <p className={styles.textJustify}>{content}</p>;

    return (
        <section className={isAccordion ? styles.section : styles.sectionFull}>
            {isAccordion ? (
                <details>
                    <summary>
                        <h2>{title}</h2>
                    </summary>
                    {contentRender}
                </details>
            ) : (
                <>
                    <h2 className={styles.centeredTitle}>{title}</h2>
                    {contentRender}
                </>
            )}
        </section>
    );
}