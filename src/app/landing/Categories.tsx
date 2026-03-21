"use client";
import Image from "next/image";
import Link from "next/link";

interface Category {
    name: string;
    image: string;
    link: string;
}

const categories: Category[] = [
    { name: "Brewers & Blenders", image: "/images/landing/categories/brewers_and_blenders.jpg", link: "/brewers-and-blenders" },
    { name: "Experimental producers", image: "/images/landing/categories/experimental_producers.jpg", link: "/experimental_producers" },
    { name: "Closed producers", image: "/images/landing/categories/closed_producers.jpg", link: "/closed-producers" },
    { name: "Lambic places", image: "/images/landing/categories/lambic_places.png", link: "/lambic-places" },
    { name: "Lambic events", image: "/images/landing/categories/lambic_events.jpg", link: "/lambic-events" },
    { name: "Lambic travels", image: "/images/landing/categories/lambic_travels.jpg", link: "/lambic-travels" },
];

export default function Categories() {
    return (
        <section className="categories-grid">
            {categories.map((cat) => (
                <Link key={cat.name} href={cat.link} className="category-card">
                    <div className="category-image-wrapper">
                        <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 
                 (max-width: 1100px) 50vw, 
                 33vw"
                            priority
                        />
                    </div>
                    <div className="category-overlay">
                        <h3>{cat.name}</h3>
                    </div>
                </Link>
            ))}
        </section>
    );
}