"use client";
import Banner from "./components/Banner";
import WhatIsLambic from "./components/What_is_lambic";
import Categories from "./components/Categories";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMobileScrollVisible, setIsMobileScrollVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!isMobile) return;

    const handleScroll = () => {
      const barrel = document.getElementById("barrel-wrapper");
      if (!barrel) return;

      const triggerPoint = window.innerHeight * 0.6;
      setIsMobileScrollVisible(barrel.getBoundingClientRect().top < triggerPoint);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="banner-container">
        <Banner />

        {/* Barrel visually pinned to bottom of banner */}
        <div
          id="barrel-wrapper"
          className={`barrel-wrapper ${isMobileScrollVisible ? "visible" : ""}`}
        >
          <Image
            src="/images/welcome/barrel.png"
            alt="Barrel"
            width={600}
            height={600}
            className="barrel-image"
            priority
          />
          <div className="barrel-overlay">
            <div className="barrel-text">
              <h2>Welcome!</h2>
              <p>
                This is an active research project which endeavors to gather
                information about lambic brewers and blenders, both past and present.
                Here you can learn about their histories, lineage, beers, events,
                locations, and more.
              </p><br />
              <p>
                This site is not intended to replace the wide variety of published
                books, research, and information available, but to instead, serve as
                a portal to that information. To that end, we cite, credit, and thank
                the authors of many primary sources we have used in conjunction with
                our own independent research and interviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <WhatIsLambic />

      {/* Button pinned above Categories */}
      <div className="categories-wrapper">
        <div className="what-is-lambic-button-wrapper">
          <button>WHAT IS LAMBIC ?</button>
        </div>
        <Categories />
      </div>
    </>
  );
}