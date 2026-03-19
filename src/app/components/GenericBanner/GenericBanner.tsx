"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./GenericBanner.module.css";

interface GenericBannerProps {
    logo?: string;
    height?: string;
    margin?: string;
    aspectRatio?: string;
    padding?: string;
}

export default function GenericBanner({
    logo = "/images/shared/lambic-info-logo.png",
    height = "5rem",
    margin = "0 0",
    aspectRatio = "2 / 1",
    padding = "3rem 1rem",
}: GenericBannerProps) {
    return (
        <header
            className={styles.banner}
            style={{
                height,
                padding,
            }}
        >
            {/* Back button */}
            <button
                onClick={() => window.history.back()}
                className={styles.backButton}
            >
                &#8592; Back
            </button>

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