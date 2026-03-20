"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./GenericBanner.module.css";

interface GenericBannerProps {
    logo?: string;
    height?: string;
    margin?: string;
    aspectRatio?: string;
    padding?: string;
    backLink?: string; // This is now our primary navigation driver
}

export default function GenericBanner({
    logo = "/images/shared/lambic-info-logo.png",
    height = "5rem",
    margin = "0 0",
    aspectRatio = "2 / 1",
    padding = "3rem 1rem",
    backLink,
}: GenericBannerProps) {
    const router = useRouter();

    const handleBackClick = (e: React.MouseEvent) => {
        // If we have a specific backLink, we let the <Link> handle it.
        // If no backLink is provided, we can keep history.back() as a fallback
        // or just let the button hide.
        if (!backLink) {
            e.preventDefault();
            router.back();
        }
    };

    return (
        <header
            className={styles.banner}
            style={{
                height,
                padding,
            }}
        >
            {/* Back button: Now uses Link if backLink exists, otherwise falls back to history */}
            {backLink ? (
                <Link href={backLink} className={styles.backButton}>
                    &#8592; Back
                </Link>
            ) : (
                <button
                    onClick={handleBackClick}
                    className={styles.backButton}
                >
                    &#8592; Back
                </button>
            )}

            {/* Logo */}
            <Link href="/">
                <div
                    className={styles.logoContainer}
                    style={{
                        height,
                        margin,
                        aspectRatio,
                    }}
                >
                    <Image
                        src={logo}
                        alt="Logo"
                        fill
                        className={styles.logo}
                        priority
                    />
                </div>
            </Link>
        </header>
    );
}