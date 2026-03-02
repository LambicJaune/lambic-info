"use client";
import Image from "next/image";
import Link from "next/link";

interface Category {
  name: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  { name: "Brewers & Blenders", image: "/images/categories/cat1.jpg", link: "/categories/cat1" },
  { name: "Experimental producers", image: "/images/categories/cat2.jpg", link: "/categories/cat2" },
  { name: "Closed producers", image: "/images/categories/cat3.jpg", link: "/categories/cat3" },
  { name: "Lambic places", image: "/images/categories/cat4.jpg", link: "/categories/cat4" },
  { name: "Lambic events", image: "/images/categories/cat5.jpg", link: "/categories/cat5" },
  { name: "Lambic travels", image: "/images/categories/cat6.jpg", link: "/categories/cat6" },
];

export default function Categories() {
  return (
    <section className="categories-grid">
      {categories.map((cat) => (
        <Link key={cat.name} href={cat.link} className="category-card">
          <Image
            src={cat.image}
            alt={cat.name}
            width={400}
            height={300}
            className="category-image"
            priority
          />
          <div className="category-overlay">
            <h3>{cat.name}</h3>
          </div>
        </Link>
      ))}
    </section>
  );
}