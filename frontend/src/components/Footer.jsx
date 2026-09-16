import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiTruck } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const BRAND_LOGO = 'https://www.thefabricstore.pk/cdn/shop/files/The-Fabric-Store-final-logo-black_white_200x@2x.svg?v=1704781392';

export default function Footer() {
  return (
    <footer className="bg-[#f7f5f1] text-[#24211f] mt-24 border-t border-[var(--line)] font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-xs">
        {/* Brand Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={BRAND_LOGO} alt="The Fabric Store Pakistan" className="w-12 h-auto" />
            <h4 className="font-heading text-lg font-bold tracking-widest uppercase">
              The Fabric Store
            </h4>
          </div>
          <p className="text-[#746e68] leading-relaxed">
            Established in 2016 with over 35 retail outlets across Pakistan and a worldwide online store. TFS is
            dedicated to bringing you the finest unstitched lawn, festive embroidered formals, ready-to-wear kurtis,
            and winter shawls.
          </p>
          <div className="flex items-center gap-3 text-lg pt-1">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="footer-social"
            >
              <FaFacebookF className="text-sm" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="footer-social"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="footer-social"
            >
              <FaTiktok className="text-sm" />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-[#24211f] mb-4 pb-1 border-b border-[var(--line)]">
            Shop Collections
          </h4>
          <ul className="space-y-2.5 text-[#746e68]">
            <li>
              <Link to="/category/sale" className="footer-link text-[#a3263d] font-semibold">
                Clearance Sale (Up to 50% Off)
              </Link>
            </li>
            <li>
              <Link to="/category/unstitched" className="footer-link">
                Unstitched Lawn & Chiffon
              </Link>
            </li>
            <li>
              <Link to="/category/ready-to-wear" className="footer-link">
                Ready To Wear Pret
              </Link>
            </li>
            <li>
              <Link to="/category/formal" className="footer-link">
                Luxury Festive Formals
              </Link>
            </li>
            <li>
              <Link to="/category/shawl" className="footer-link">
                Winter Wool & Pashmina Shawls
              </Link>
            </li>
            <li>
              <Link to="/category/new-arrivals" className="footer-link">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-[#24211f] mb-4 pb-1 border-b border-[var(--line)]">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-[#746e68]">
            <li>
              <Link to="/track-order" className="footer-link flex items-center gap-1.5">
                <FiTruck />
                <span>Track Your Shipment</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className="footer-link">
                Order History & Invoices
              </Link>
            </li>
            <li>
              <span className="text-[#746e68]">Nationwide Free Shipping (Above Rs. 3,000)</span>
            </li>
            <li>
              <span className="text-[#746e68]">7-Day Return / Exchange Policy</span>
            </li>
            <li>
              <span className="text-[#746e68]">Cash on Delivery (COD) Across Pakistan</span>
            </li>
          </ul>
        </div>

        {/* Head Office & WhatsApp Support */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-[#24211f] mb-4 pb-1 border-b border-[var(--line)]">
            Contact & Support
          </h4>
          <ul className="space-y-3 text-[#746e68]">
            <li className="flex items-start gap-2.5">
              <FiMail className="text-brand text-base shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-[#24211f]">support@thefabricstore.pk</span>
                <span className="text-[11px] text-[#746e68]">Inquiries & Corporate Orders</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Trust Strip */}
      <div className="border-t border-[var(--line)] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#746e68]">
          <p>&copy; {new Date().getFullYear()} The Fabric Store Pakistan (TFS) by EGI Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery (COD)</span>
            <span>&bull;</span>
            <span>Direct Bank Transfer</span>
            <span>&bull;</span>
            <span>Online Card Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
