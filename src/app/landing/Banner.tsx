export default function Banner() {
    return (
        <section className="banner">
            {/* Top decorations */}
            <img src="/images/landing/banner/decor-left.png" className="decor decor-left" alt="art-nouveau style corner frame" />
            <img src="/images/landing/banner/decor-right.png" className="decor decor-right" alt="art-nouveau style corner frame" />

            {/* Hero text */}
            <div className="hero-text">
                <p>UNFILTERED KNOWLEDGE.</p>
                <p>UNBLENDED HISTORY.</p>
            </div>
        </section>
    );
}