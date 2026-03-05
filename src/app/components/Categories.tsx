"use client";
import Image from "next/image";
import Link from "next/link";

interface Category {
    name: string;
    image: string;
    link: string;
}

const categories: Category[] = [
    { name: "Brewers & Blenders", image: "/images/categories/brewers_and_blenders.jpg", link: "/categories/brewers_and_blenders" },
    { name: "Experimental producers", image: "/images/categories/experimental_producers.jpg", link: "/categories/experimental_producers" },
    { name: "Closed producers", image: "/images/categories/closed_producers.jpg", link: "/categories/closed_producers" },
    { name: "Lambic places", image: "/images/categories/lambic_places.png", link: "/categories/lambic_places" },
    { name: "Lambic events", image: "/images/categories/lambic_events.jpg", link: "/categories/lambic_events" },
    { name: "Lambic travels", image: "/images/categories/lambic_travels.jpg", link: "/categories/lambic_travels" },
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