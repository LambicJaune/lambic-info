"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import styles from "./GenericFooter.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-content"]}>
        <div className={styles["footer-links"]}>
          <p className={styles["footer-title"]}>LEARN MORE:</p>
          <ul>
            <li><Link href="/info/the-team">The Team</Link></li>
            <li><Link href="/info/books">Books</Link></li>
            <li><Link href="/info/bibliography">Bibliography</Link></li>
            <li><Link href="/info/glossary">Glossary</Link></li>
            <li><Link href="/info/horal">HORAL</Link></li>
            <li><Link href="/info/lambic-groups">Lambic Groups</Link></li>
            <li><Link href="/info/museums">Museums</Link></li>
          </ul>
        </div>
        <div className={styles["footer-social"]}>
          <a href="https://www.instagram.com/lambicdotifo" target="_blank" rel="noopener noreferrer" aria-label="Lambic.Info on Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.facebook.com/groups/Lambic.Info" target="_blank" rel="noopener noreferrer" aria-label="Lambic.Info Facebook group">
            <FaFacebookF />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
