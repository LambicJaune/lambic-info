import Image from "next/image";

export default function Banner() {
    return (
        <section className="banner">

            {/* Hops near decorations */}
            <img src="images/banner/hops-left.png" className="hops hops-left" alt="hops near left corner" />
            <img src="images/banner/hops-right.png" className="hops hops-right" alt="hops near right corner" />

            {/* Top decorations */}
            <img src="/images/banner/decor-left.png" className="decor decor-left" alt="art-nouveau style corner frame" />
            <img src="/images/banner/decor-right.png" className="decor decor-right" alt="art-nouveau style corner frame" />

            <div className="banner-main-elements">
                {/* Hero text */}
                <div className="hero-text">
                    <p>UNFILTERED KNOWLEDGE.</p>
                    <p>UNBLENDED HISTORY.</p>
                </div>
        
                <img src="/images/banner/lambic_info_logo_yellow.png" className="logo" alt="LambicInfo Logo" />
            </div>
        </section>
    );
}