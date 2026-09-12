import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiMessageCircle,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';

const HERO_SLIDES = [
  {
    eyebrow: 'Stock Clearance Sale',
    title: 'Flat 50% & 40% Off',
    detail: 'Shop signature lawn, chiffon, pret and shawls before they are gone.',
    cta: 'Shop Sale',
    slug: 'sale',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/Mobile_Banner_Final_x800.jpg?v=1788275569',
  },
  {
    eyebrow: 'Pret Ready to Wear',
    title: 'Modern Kurtis & Co-ords',
    detail: 'Effortless stitched elegance tailored for every occasion',
    cta: 'Shop Ready To Wear',
    slug: 'ready-to-wear',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/Ready_to_wear-Emb_1000x.jpg?v=1771330296',
  },
  {
    eyebrow: 'Limited Seasonal Clearance',
    title: 'Summer Sale',
    detail: 'Up to 50% off on signature 2-piece and 3-piece suits',
    cta: 'Shop Sale',
    slug: 'sale',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/New_Ariivals_1000x.jpg?v=1771221160',
  },
];

const CURATED_COLLECTIONS = [
  {
    title: 'Sale & Clearance',
    subtitle: 'Up to 50% Off',
    slug: 'sale',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/New_Ariivals_1000x.jpg?v=1771221160',
  },
  {
    title: 'Unstitched Lawn',
    subtitle: '1, 2 & 3 Piece Suits',
    slug: 'unstitched',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/Ready_to_wear-Emb_1000x.jpg?v=1771330296',
  },
  {
    title: 'Ready To Wear',
    subtitle: 'Daily Pret & Formals',
    slug: 'ready-to-wear',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/Bottoms_1000x.jpg?v=1771827769',
  },
  {
    title: 'Luxury Formal',
    subtitle: 'Chiffon & Net',
    slug: 'formal',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/FSE719-YELLOW_2_600x.jpg?v=1781870517',
  },
  {
    title: 'Winter Shawls',
    subtitle: 'Pure Wool & Pashmina',
    slug: 'shawl',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/FSE710-PURPLE_2_600x.jpg?v=1781870498',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Latest Seasonal Drop',
    slug: 'new-arrivals',
    image: 'https://www.thefabricstore.pk/cdn/shop/files/FSP1365-PURPLE_2_600x.jpg?v=1781870527',
  },
];

const DISCOUNT_BANDS = [
  { label: '10% Discount', query: 'minPrice=1', tone: 'bg-[#f7eee9]' },
  { label: '15% Discount', query: 'maxPrice=5000', tone: 'bg-[#f2e4e4]' },
  { label: '20% Discount', query: 'minPrice=5000&maxPrice=8000', tone: 'bg-[#eee6dc]' },
  { label: '25% Discount', query: 'minPrice=8000', tone: 'bg-[#e8e2d8]' },
  { label: '30% Discount', query: 'maxPrice=3500', tone: 'bg-[#eadfe1]' },
];

const FALLBACK_PRODUCT_IMAGES = [
  'https://www.thefabricstore.pk/cdn/shop/files/FSP1365-PURPLE_2_600x.jpg?v=1781870527',
  'https://www.thefabricstore.pk/cdn/shop/files/FSE719-YELLOW_2_600x.jpg?v=1781870517',
  'https://www.thefabricstore.pk/cdn/shop/files/FSE719-ICE-BLUE_2_600x.jpg?v=1781870506',
  'https://www.thefabricstore.pk/cdn/shop/files/FSE710-PURPLE_2_600x.jpg?v=1781870498',
  'https://www.thefabricstore.pk/cdn/shop/files/FSE709-GREY_2_600x.jpg?v=1781870489',
  'https://www.thefabricstore.pk/cdn/shop/files/FSP1445-ICE-BLUE_2_600x.jpg?v=1781870450',
];

function createFallbackProducts(prefix, names, fabric, categorySlug) {
  return names.map((name, index) => ({
    _id: `homepage-${prefix}-${index}`,
    slug: `homepage-${prefix}-${index}`,
    name,
    fabric,
    pieces: index % 2 === 0 ? 3 : 2,
    price: 2899 + index * 650,
    compareAtPrice: 4999 + index * 900,
    images: [FALLBACK_PRODUCT_IMAGES[index % FALLBACK_PRODUCT_IMAGES.length]],
    category: { name: categorySlug.replace(/-/g, ' '), slug: categorySlug },
    isNewArrival: prefix === 'summer',
    totalStock: 12,
    variants: [{ _id: `homepage-variant-${prefix}-${index}`, size: 'Free Size', color: 'Assorted', stock: 12 }],
  }));
}

const FALLBACK_COLLECTIONS = {
  summer: createFallbackProducts(
    'summer',
    ['Printed Lawn 3 Piece Suit', 'Embroidered Lawn 3 Piece', 'Embellished Chiffon 3 Piece', 'Printed Lawn 2 Piece'],
    'Lawn',
    'unstitched',
  ),
  pret: createFallbackProducts(
    'pret',
    ['Printed Lawn Pret 3 Piece', 'Embroidered Pret Lawn', 'Solid Jacquard Co-ord', 'Printed Chiffon Kurti'],
    'Pret',
    'ready-to-wear',
  ),
  shawl: createFallbackProducts(
    'shawl',
    ['Embroidered Lawn Shawl', 'Soft Wool Shawl', 'Semi Pashmina Shawl', 'Karandi Lawn Shawl'],
    'Shawl',
    'shawl',
  ),
  sale: createFallbackProducts(
    'sale',
    ['Printed Lawn Clearance Suit', 'Embroidered Chiffon Sale Edit', 'Printed Khaddar 2 Piece', 'Pashmina Sale Shawl'],
    'Sale Edit',
    'sale',
  ),
};

function ProductSection({ eyebrow, title, slug, products, fallbackProducts, loading, tone = 'plain' }) {
  const visibleProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <section className={`page-shell mt-16 sm:mt-20 ${tone === 'tinted' ? 'py-10 sm:py-14 bg-[#faf6f1]' : ''}`}>
      <div className="section-heading mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand font-bold">{eyebrow}</span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-gray-900 mt-0.5">
            {title}
          </h2>
        </div>
        <Link
          to={`/category/${slug}`}
          className="shrink-0 text-xs font-semibold text-brand uppercase tracking-wider hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <FiArrowRight />
        </Link>
      </div>

      {loading && products.length === 0 ? (
        <ProductGridSkeleton count={4} />
      ) : visibleProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 py-10 text-center text-xs text-gray-500">
          New pieces are being added to this collection.
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [bestSellers, setBestSellers] = useState(null);
  const [newArrivals, setNewArrivals] = useState(null);
  const [pretCollection, setPretCollection] = useState(null);
  const [shawls, setShawls] = useState(null);
  const [summerCollection, setSummerCollection] = useState(null);
  const [saleCollection, setSaleCollection] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((c) => (c + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real products from backend
  useEffect(() => {
    api
      .get('/products', { params: { featured: 'true', limit: 4 } })
      .then((r) => setFeatured(r.data.products || []))
      .catch(() => setFeatured([]));

    api
      .get('/products', { params: { bestSeller: 'true', limit: 4 } })
      .then((r) => setBestSellers(r.data.products || []))
      .catch(() => setBestSellers([]));

    api
      .get('/products', { params: { category: 'new-arrivals', limit: 4 } })
      .then((r) => setNewArrivals(r.data.products || []))
      .catch(() => setNewArrivals([]));

    const collections = [
      { category: 'ready-to-wear', setter: setPretCollection },
      { category: 'shawl', setter: setShawls },
      { category: 'unstitched', setter: setSummerCollection },
      { category: 'sale', setter: setSaleCollection },
    ];

    collections.forEach(({ category, setter }) => {
      api
        .get('/products', { params: { category, limit: 4 } })
        .then((r) => setter(r.data.products || []))
        .catch(() => setter([]));
    });
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className="font-body text-gray-900">
      {/* 1. Full-Width Editorial Hero Carousel */}
      <section className="relative w-full overflow-hidden bg-black text-white">
        <div className="relative h-[28rem] sm:h-[36rem] lg:h-[42rem]">
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000"
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 ${activeSlide === 0 ? 'bg-black/10' : 'bg-gradient-to-r from-black/75 via-black/35 to-transparent'}`} />

          {/* Slide Text Content */}
          <div className="relative z-10 max-w-7xl mx-auto h-full flex items-end pb-16 sm:pb-24 px-6 sm:px-12">
            <div className={`max-w-xl ${activeSlide === 0 ? 'drop-shadow-lg' : ''}`}>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-amber-200 font-bold">
                {slide.eyebrow}
              </span>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mt-2 drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg text-white/90 mt-3 font-light max-w-md">
                {slide.detail}
              </p>
              <Link
                to={`/category/${slide.slug}`}
                className="mt-6 inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-xs uppercase tracking-[0.2em] font-semibold py-3 px-8 rounded shadow-lg transition-colors"
              >
                <span>{slide.cta}</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Slide Arrows */}
          <button
            onClick={() => setActiveSlide((activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 p-2.5 text-white backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="text-xl" />
          </button>
          <button
            onClick={() => setActiveSlide((activeSlide + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 p-2.5 text-white backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <FiChevronRight className="text-xl" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.title}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Customer Trust Props Strip */}
      <section className="bg-[#faf6f1] border-y border-brand/10 py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <FiTruck className="text-2xl text-brand mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">Free Nationwide Shipping</span>
            <span className="text-[11px] text-gray-500">On all orders above Rs. 3,000</span>
          </div>
          <div className="flex flex-col items-center">
            <FiShield className="text-2xl text-brand mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">100% Original Fabric</span>
            <span className="text-[11px] text-gray-500">Premium lawn, chiffon & silk guarantee</span>
          </div>
          <div className="flex flex-col items-center">
            <FiRotateCcw className="text-2xl text-brand mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">7-Day Easy Exchange</span>
            <span className="text-[11px] text-gray-500">Hassle-free replacement policy</span>
          </div>
          <div className="flex flex-col items-center">
            <FiMessageCircle className="text-2xl text-[#25D366] mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">24/7 WhatsApp Support</span>
            <span className="text-[11px] text-gray-500">Direct order updates: 0300-0606664</span>
          </div>
        </div>
      </section>

      {/* 3. Season Quick Bar */}
      <section className="page-shell mt-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand">Popular Categories</span>
          <div className="flex gap-2 sm:gap-4 overflow-x-auto text-xs whitespace-nowrap pb-1 max-w-full scrollbar-hide">
            <Link to="/category/sale" className="font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded">
              Clearance Sale
            </Link>
            <Link to="/category/unstitched?pieces=3" className="hover:text-brand bg-gray-100 hover:bg-cream px-3 py-1.5 rounded transition-colors">
              3 Piece Unstitched
            </Link>
            <Link to="/category/unstitched?fabric=Lawn" className="hover:text-brand bg-gray-100 hover:bg-cream px-3 py-1.5 rounded transition-colors">
              Pure Lawn
            </Link>
            <Link to="/category/ready-to-wear" className="hover:text-brand bg-gray-100 hover:bg-cream px-3 py-1.5 rounded transition-colors">
              Pret Kurtis
            </Link>
            <Link to="/category/formal" className="hover:text-brand bg-gray-100 hover:bg-cream px-3 py-1.5 rounded transition-colors">
              Festive Chiffon
            </Link>
            <Link to="/category/shawl" className="hover:text-brand bg-gray-100 hover:bg-cream px-3 py-1.5 rounded transition-colors">
              Winter Shawls
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Curated Collections Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-brand font-bold">Curated For You</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-gray-900 mt-1">
              Shop Collections
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CURATED_COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded bg-gray-100 shadow-sm"
            >
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] text-amber-200 font-medium block uppercase tracking-wider">
                  {c.subtitle}
                </span>
                <h3 className="font-heading text-sm font-bold leading-tight group-hover:text-amber-100 transition-colors">
                  {c.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand font-bold">Handpicked Highlights</span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-gray-900 mt-0.5">
              Featured Designs
            </h2>
          </div>
          <Link
            to="/category/unstitched"
            className="text-xs font-semibold text-brand uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>

        {featured === null ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Original-style discount navigation */}
      <section className="page-shell mt-16 sm:mt-20">
        <div className="section-heading mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand font-bold">Sale By Discount</span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-gray-900 mt-0.5">
              Shop the markdowns
            </h2>
          </div>
          <Link to="/category/sale" className="text-xs font-semibold text-brand uppercase tracking-wider hover:underline">
            View All Sale
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {DISCOUNT_BANDS.map((band) => (
            <Link
              key={band.label}
              to={`/category/sale?${band.query}`}
              className={`${band.tone} min-h-20 sm:min-h-24 flex items-center justify-center text-center px-3 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-gray-900 hover:bg-brand hover:text-white transition-colors`}
            >
              {band.label}
            </Link>
          ))}
        </div>
      </section>

      <ProductSection
        eyebrow="Pret / Unstitched"
        title="Summer Collection '26"
        slug="unstitched"
        products={summerCollection || []}
        fallbackProducts={FALLBACK_COLLECTIONS.summer}
        loading={summerCollection === null}
        tone="tinted"
      />

      <ProductSection
        eyebrow="For the elegant summer woman"
        title="Pret Unstitched"
        slug="ready-to-wear"
        products={pretCollection || []}
        fallbackProducts={FALLBACK_COLLECTIONS.pret}
        loading={pretCollection === null}
      />

      <ProductSection
        eyebrow="Soft layers, rich textures"
        title="Shawl"
        slug="shawl"
        products={shawls || []}
        fallbackProducts={FALLBACK_COLLECTIONS.shawl}
        loading={shawls === null}
        tone="tinted"
      />

      {/* 10. Brand Story & Campaign Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
        <div className="grid md:grid-cols-2 overflow-hidden rounded-xl bg-[#241a1c] text-white shadow-xl">
          <div
            className="min-h-[22rem] bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1550614000-4b95d4edfa92?auto=format&fit=crop&w=1200&q=85)',
            }}
          />
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200 font-bold">
              The Fabric Store Pakistan
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-2 leading-tight">
              Crafted with Passion. Worn with Pride.
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-4 leading-relaxed font-light">
              Established in 2016 with over 35 retail outlets across Pakistan and a worldwide online store, TFS brings
              you luxurious unstitched fabrics, festive embroidered chiffons, and modern everyday pret celebrating true
              Pakistani craftsmanship.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/category/unstitched"
                className="bg-white hover:bg-cream text-gray-950 text-xs font-bold uppercase tracking-[0.18em] py-3 px-6 rounded transition-colors"
              >
                Discover Collection
              </Link>
              <Link
                to="/category/sale"
                className="border border-white/40 hover:border-white text-white text-xs font-bold uppercase tracking-[0.18em] py-3 px-6 rounded transition-colors"
              >
                View Seasonal Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProductSection
        eyebrow="Customer favorites"
        title="Best Selling"
        slug="ready-to-wear"
        products={bestSellers || []}
        fallbackProducts={FALLBACK_COLLECTIONS.pret}
        loading={bestSellers === null}
      />

      <ProductSection
        eyebrow="Clearance edit"
        title="Sale Collection"
        slug="sale"
        products={saleCollection || []}
        fallbackProducts={FALLBACK_COLLECTIONS.sale}
        loading={saleCollection === null}
        tone="tinted"
      />

      {/* 8. Floating Action Buttons (WhatsApp & Scroll Top) */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-3">
        <a
          href="https://wa.me/923000606664?text=Hi%20TFS%2C%20I%20would%20like%20to%20inquire%20about%20a%20product%20on%20your%20website"
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-3xl text-white shadow-xl hover:scale-110 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <FiMessageCircle />
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-10 w-10 items-center justify-center bg-gray-900 text-base text-white rounded-full shadow-lg hover:bg-brand transition-colors"
          aria-label="Scroll to top"
        >
          <FiArrowUp />
        </button>
      </div>
    </div>
  );
}
