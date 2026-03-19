"use client";
import { useEffect, useState } from "react";
import Banner from "./landing/Banner";
import WhatIsLambic from "./landing/WhatIsLambic";
import Categories from "./landing/Categories";
import Footer from "./components/GenericFooter";
import Image from "next/image";

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [isMobileScrollVisible, setIsMobileScrollVisible] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (!isTouchDevice) return;

        const scrollThreshold = 100; // scroll 100px down before showing overlay, adjust as needed

        const handleScroll = () => {
            setIsMobileScrollVisible(window.scrollY > scrollThreshold);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // check initial scroll

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isClient]);

    // Always render hidden on SSR, add "client" class only on client mount
    const barrelClasses = ["barrel-wrapper"];
    if (isClient) barrelClasses.push("client");
    if (isMobileScrollVisible) barrelClasses.push("visible");

    return (
        <>
            <div className="banner-container">
                <Banner />

                <div id="barrel-wrapper" className={barrelClasses.join(" ")}>
                    <Image
                        src="/images/landing/welcome/barrel.png"
                        alt="Barrel with logo"
                        width={820}
                        height={1026}
                        className="barrel-image"
                        priority
                    />
                    <div className="barrel-overlay">
                        <div className="barrel-text">
                            <h2>Welcome!</h2>
                            <p>
                                This is an active research project which endeavors to gather information about
                                lambic brewers and blenders, both past and present. Here you can learn about
                                their histories, lineage, beers, events, locations, and more.
                            </p>
                            <p className="desktop-only-text">
                                This site is not intended to replace the wide variety of published books,
                                research, and information available, but to instead, serve as a portal to that
                                information. To that end, we cite, credit, and thank the authors of many primary
                                sources we have used in conjunction with our own independent research and
                                interviews.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <WhatIsLambic />

            <div className="categories-wrapper">
                <div className="what-is-lambic-button-wrapper">
                    <button>WHAT IS LAMBIC ?</button>
                </div>
                <Categories />
                <Footer />
            </div>
        </>
    );
}