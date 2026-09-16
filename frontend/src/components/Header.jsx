import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/client';

const NAV_ITEMS = [
  {
    label: 'New Arrivals',
    to: '/category/new-arrivals',
    isNew: true,
  },
  {
    label: 'Unstitched',
    to: '/category/unstitched',
    columns: [
      {
        title: 'By Piece',
        items: [
          { label: 'All Unstitched', to: '/category/unstitched' },
          { label: '1 Piece Suits', to: '/category/unstitched?pieces=1' },
          { label: '2 Piece Suits', to: '/category/unstitched?pieces=2' },
          { label: '3 Piece Suits', to: '/category/unstitched?pieces=3' },
        ],
      },
      {
        title: 'By Fabric',
        items: [
          { label: 'Lawn Suits', to: '/category/unstitched?fabric=Lawn' },
          { label: 'Chiffon Suits', to: '/category/unstitched?fabric=Chiffon' },
          { label: 'Khaddar Suits', to: '/category/unstitched?fabric=Khaddar' },
          { label: 'Karandi Suits', to: '/category/unstitched?fabric=Karandi' },
        ],
      },
    ],
  },
  {
    label: 'Ready To Wear',
    to: '/category/ready-to-wear',
    columns: [
      {
        title: 'Pret Collection',
        items: [
          { label: 'All Ready To Wear', to: '/category/ready-to-wear' },
          { label: '1 Piece Kurtis', to: '/category/ready-to-wear?pieces=1' },
          { label: '2 Piece Co-ords', to: '/category/ready-to-wear?pieces=2' },
          { label: '3 Piece Stitched Suits', to: '/category/ready-to-wear?pieces=3' },
        ],
      },
      {
        title: 'Fabrics & Silhouettes',
        items: [
          { label: 'Pret Lawn', to: '/category/ready-to-wear?fabric=Lawn' },
          { label: 'Pret Jacquard', to: '/category/ready-to-wear?fabric=Jacquard' },
          { label: 'Pret Karandi', to: '/category/ready-to-wear?fabric=Karandi' },
          { label: 'Pret Cambric', to: '/category/ready-to-wear?fabric=Cambric' },
        ],
      },
    ],
  },
  {
    label: 'Formal',
    to: '/category/formal',
    columns: [
      {
        title: 'Occasion Wear',
        items: [
          { label: 'All Formals', to: '/category/formal' },
          { label: 'Luxury Chiffon', to: '/category/formal?fabric=Chiffon' },
          { label: 'Embellished Net', to: '/category/formal?fabric=Net' },
          { label: 'Festive 3 Pcs', to: '/category/formal?pieces=3' },
        ],
      },
    ],
  },
  {
    label: 'Shawl',
    to: '/category/shawl',
    columns: [
      {
        title: 'Winter Shawls',
        items: [
          { label: 'All Shawls', to: '/category/shawl' },
          { label: 'Pure Wool Shawls', to: '/category/shawl?fabric=Wool' },
          { label: 'Pashmina Touch', to: '/category/shawl?fabric=Pashmina' },
          { label: 'Velvet Shawls', to: '/category/shawl?fabric=Velvet' },
          { label: 'Karandi Shawls', to: '/category/shawl?fabric=Karandi' },
        ],
      },
    ],
  },
];

const BRAND_LOGO = 'https://www.thefabricstore.pk/cdn/shop/files/The-Fabric-Store-final-logo-black_white_200x@2x.svg?v=1704781392';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout, isAdmin } = useAuth();
  const { itemCount, openCartDrawer } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Live search debounce
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get('/products/search', { params: { q: query, limit: 5 } });
        setSearchResults(res.data.products || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close search and mobile drawer on route changes
  useEffect(() => {
    setSearchOpen(false);
    setMobileOpen(false);
    setQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header
      className={`${location.pathname === '/' ? 'fixed top-0 left-0 right-0' : 'sticky top-0'} z-40 border-b font-body transition-all duration-500 ${
        location.pathname === '/' && !scrolled
          ? 'bg-transparent border-transparent text-white'
          : 'bg-[#f7f5f1] border-[var(--line)] text-[#24211f] shadow-sm'
      }`}
    >
      {/* Main Navbar */}
      <div className="page-shell relative flex items-center justify-between min-h-[5rem] py-3">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 -ml-2 text-2xl text-gray-800 hover:text-brand transition-colors"
          aria-label="Open mobile menu"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center group min-w-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <img src={BRAND_LOGO} alt="The Fabric Store Pakistan" className="w-36 sm:w-48 h-auto object-contain shrink-0" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex lg:absolute lg:left-12 lg:right-1/2 lg:mr-24 items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.16em]">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="mega-menu-trigger relative h-full py-4">
              <Link
                to={item.to}
                className={`relative flex items-center gap-1 transition-colors hover:text-brand ${
                  item.isSale
                    ? 'text-[#f3a0b0] font-bold'
                    : item.isNew
                      ? 'text-[#f3c7cf] font-bold'
                      : location.pathname === '/' && !scrolled
                        ? 'text-white'
                        : 'text-[#24211f]'
                } ${location.pathname === item.to ? 'text-brand' : ''}`}
              >
                {item.label}
                {item.columns && <FiChevronDown className="text-[10px] opacity-60" />}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-brand transition-all duration-300 ${
                    location.pathname === item.to ? 'w-full' : 'w-0 hover:w-full'
                  }`}
                />
              </Link>

              {/* Mega Menu Dropdown */}
              {item.columns && (
                <div className="mega-menu fixed left-0 right-0 top-[5.25rem] z-50 w-screen bg-white border-t-2 border-brand border-b border-gray-200 px-8 py-8 shadow-2xl">
                  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {item.columns.map((col) => (
                      <div key={col.title}>
                        <h4 className="font-heading text-xs font-black uppercase tracking-[0.22em] text-[#8a2b3d] border-b-2 border-brand/30 pb-2 mb-3.5">
                          {col.title}
                        </h4>
                        <ul className="space-y-1">
                          {col.items.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                to={sub.to}
                                className="text-[13.5px] font-semibold text-gray-900 hover:text-brand hover:translate-x-1.5 transition-all inline-block tracking-wide py-1"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {/* Visual campaign mini-card in mega menu */}
                    <div className="col-span-1 md:col-span-2 bg-[#f8f5f0] border border-gray-200/90 p-4 rounded-lg flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=300&q=80"
                        alt="Collection Spotlight"
                        className="w-20 h-24 object-cover rounded shadow-sm"
                      />
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-brand font-bold">
                          Exclusive Edit
                        </span>
                        <h5 className="font-heading text-sm font-semibold text-gray-900 mt-0.5">
                          Luxury Unstitched & Pret
                        </h5>
                        <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                          Discover vibrant handpicked prints, premium lawn and rich chiffon formal wear.
                        </p>
                        <Link
                          to={item.to}
                          className="text-[11px] font-bold text-brand uppercase tracking-wider mt-2 inline-block hover:underline"
                        >
                          Explore Collection &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Utility Icons */}
        <div
          className={`flex items-center gap-0.5 sm:gap-3 shrink-0 lg:ml-auto ${
            location.pathname === '/' && !scrolled ? 'text-white' : 'text-gray-800'
          }`}
        >
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:text-brand transition-colors text-lg"
            aria-label="Search catalog"
          >
            <FiSearch />
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="p-2 hover:text-brand transition-colors text-lg relative"
            aria-label="Saved items"
          >
            <FiHeart />
          </Link>

          {/* Cart Bag with Drawer Trigger */}
          <button
            onClick={openCartDrawer}
            className="p-2 hover:text-brand transition-colors text-lg relative"
            aria-label="Shopping bag"
          >
            <FiShoppingBag />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Account Dropdown */}
          <div className="relative group hidden sm:block">
            <button
              className="p-2 rounded-full hover:bg-gray-100 hover:text-brand transition-colors text-lg"
              aria-label="User account"
            >
              <FiUser />
            </button>
            <div className="absolute right-0 top-full hidden group-hover:block bg-white text-[#24211f] shadow-xl border border-gray-100 rounded-lg py-2 w-48 text-xs z-50">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-900 truncate">
                    Hello, {user.name.split(' ')[0]}
                  </div>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-cream hover:text-brand">
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-cream hover:text-brand">
                    My Wishlist
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-brand font-semibold hover:bg-cream">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 border-t border-gray-100 mt-1"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 font-semibold hover:bg-cream hover:text-brand">
                    Sign In
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 hover:bg-cream hover:text-brand">
                    Create Account
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <Link to="/track-order" className="block px-4 py-2 text-[#24211f] hover:bg-cream hover:text-brand">
                    Track Order
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Predictive Search Bar Overlay */}
      {searchOpen && (
        <div className="border-b border-gray-200 bg-white py-4 px-4 shadow-lg animate-slide-down">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <FiSearch className="absolute left-4 text-gray-400 text-lg" />
              <input
                ref={searchRef}
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by suit name, fabric (Lawn, Chiffon, Shawl), or style..."
                className="w-full pl-12 pr-24 py-3 bg-gray-50 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <button
                type="submit"
                className="absolute right-2 bg-brand text-white text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full hover:bg-brand-dark transition-colors"
              >
                Search
              </button>
            </form>

            {/* Live Search Results Dropdown */}
            {query.length >= 2 && (
              <div className="mt-3 bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden divide-y divide-gray-100">
                {searchLoading ? (
                  <div className="p-4 text-center text-xs text-gray-500">Searching catalog...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No matching suits found for "{query}". Try searching for 'Lawn', 'Chiffon', or 'Shawl'.
                  </div>
                ) : (
                  <>
                    <div className="p-2 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Matching Products ({searchResults.length})
                    </div>
                    {searchResults.map((p) => (
                      <Link
                        key={p._id}
                        to={`/product/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-cream transition-colors"
                      >
                        <img
                          src={p.images?.[0]}
                          alt=""
                          className="w-12 h-14 object-cover rounded bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-gray-500">
                            {p.fabric} {p.pieces ? `· ${p.pieces} Piece` : ''}
                          </p>
                        </div>
                        <span className="font-bold text-xs text-brand">
                          Rs. {p.price?.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                    <Link
                      to={`/search?q=${encodeURIComponent(query)}`}
                      onClick={() => setSearchOpen(false)}
                      className="block p-2.5 text-center text-xs font-semibold text-brand bg-brand/5 hover:bg-brand/10 transition-colors uppercase tracking-wider"
                    >
                      View all results &rarr;
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[88%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-slide-in-left">
            <div className="h-20 px-7 flex items-center justify-between border-b border-gray-100">
              <span className="text-[11px] uppercase tracking-[0.28em] text-gray-400">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-3xl font-light text-[#24211f] hover:text-brand transition-colors"
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <nav className="px-7 py-5 text-[#24211f]">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="border-b border-gray-100 last:border-0">
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-5 text-[15px] uppercase tracking-[0.2em] hover:text-brand transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.columns && <FiChevronRight className="text-xl text-gray-500" />}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="mt-auto border-t border-gray-200 text-[#24211f]">
              <div className="px-7 py-6">
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-[13px] uppercase tracking-[0.2em] hover:text-brand">
                    <FiUser className="text-xl" /> My Orders
                  </Link>
                  <button onClick={logout} className="mt-5 text-[11px] uppercase tracking-[0.2em] text-red-600">
                    Log Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-[13px] uppercase tracking-[0.2em] hover:text-brand">
                    <FiUser className="text-xl" /> Log In
                  </Link>
              )}
              </div>
              <div className="border-t border-gray-200 px-7 py-6 flex items-center gap-4 text-[13px] uppercase tracking-[0.2em] text-gray-600">
                <span className="text-lg">🇺🇸</span>
                <span>USD $</span>
                <FiChevronDown className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
