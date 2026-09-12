import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiInstagram,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiTruck,
  FiShield,
} from 'react-icons/fi';

const BRAND_LOGO = 'https://www.thefabricstore.pk/cdn/shop/files/The-Fabric-Store-final-logo-black_white_200x@2x.svg?v=1704781392';

export default function Footer() {
  return (
    <footer className="bg-[#1a1415] text-white mt-20 border-t border-brand/20 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-xs">
        {/* Brand Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={BRAND_LOGO} alt="The Fabric Store Pakistan" className="w-12 h-auto brightness-0 invert" />
            <h4 className="font-heading text-lg font-bold tracking-widest uppercase">
              The Fabric Store
            </h4>
          </div>
          <p className="text-white/70 leading-relaxed">
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
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand flex items-center justify-center transition-colors"
            >
              <FiFacebook className="text-sm" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand flex items-center justify-center transition-colors"
            >
              <FiInstagram className="text-sm" />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-amber-200 mb-4 pb-1 border-b border-white/10">
            Shop Collections
          </h4>
          <ul className="space-y-2.5 text-white/75">
            <li>
              <Link to="/category/sale" className="hover:text-amber-200 transition-colors text-red-400 font-semibold">
                Clearance Sale (Up to 50% Off)
              </Link>
            </li>
            <li>
              <Link to="/category/unstitched" className="hover:text-amber-200 transition-colors">
                Unstitched Lawn & Chiffon
              </Link>
            </li>
            <li>
              <Link to="/category/ready-to-wear" className="hover:text-amber-200 transition-colors">
                Ready To Wear Pret
              </Link>
            </li>
            <li>
              <Link to="/category/formal" className="hover:text-amber-200 transition-colors">
                Luxury Festive Formals
              </Link>
            </li>
            <li>
              <Link to="/category/shawl" className="hover:text-amber-200 transition-colors">
                Winter Wool & Pashmina Shawls
              </Link>
            </li>
            <li>
              <Link to="/category/new-arrivals" className="hover:text-amber-200 transition-colors">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-amber-200 mb-4 pb-1 border-b border-white/10">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-white/75">
            <li>
              <Link to="/track-order" className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
                <FiTruck />
                <span>Track Your Shipment</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-amber-200 transition-colors">
                Order History & Invoices
              </Link>
            </li>
            <li>
              <span className="text-white/60">Nationwide Free Shipping (Above Rs. 3,000)</span>
            </li>
            <li>
              <span className="text-white/60">7-Day Return / Exchange Policy</span>
            </li>
            <li>
              <span className="text-white/60">Cash on Delivery (COD) Across Pakistan</span>
            </li>
          </ul>
        </div>

        {/* Head Office & WhatsApp Support */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-amber-200 mb-4 pb-1 border-b border-white/10">
            Contact & Support
          </h4>
          <ul className="space-y-3 text-white/75">
            <li className="flex items-start gap-2.5">
              <FiPhone className="text-brand-light text-base shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">0300-0606664</span>
                <span className="text-[11px] text-white/60">Call & WhatsApp Support</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <FiMail className="text-brand-light text-base shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">support@thefabricstore.pk</span>
                <span className="text-[11px] text-white/60">Inquiries & Corporate Orders</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <FiClock className="text-brand-light text-base shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">Mon – Sat: 10:00 AM – 9:00 PM</span>
                <span className="text-[11px] text-white/60">Pakistan Standard Time (PKT)</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Trust Strip */}
      <div className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
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
