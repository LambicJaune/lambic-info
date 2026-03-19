"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <p className="footer-title">LEARN MORE:</p>
          <ul>
            <li><Link href="/team">The Team</Link></li>
            <li><Link href="/books">Books</Link></li>
            <li><Link href="/bibliography">Bibliography</Link></li>
            <li><Link href="/glossary">Glossary</Link></li>
            <li><Link href="/horal">HORAL</Link></li>
            <li><Link href="/lambic-groups">Lambic Groups</Link></li>
            <li><Link href="/museums">Museums</Link></li>
          </ul>
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;