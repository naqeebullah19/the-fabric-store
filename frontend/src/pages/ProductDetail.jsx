import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiRotateCcw,
  FiShield,
  FiChevronRight,
  FiCheck,
  FiInfo,
  FiStar,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

const GUEST_WISHLIST_KEY = 'tfs_guest_wishlist';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', reviewerName: '' });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Fetch product by slug
  useEffect(() => {
    setProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    api
      .get(`/products/${slug}`)
      .then((r) => {
        setProduct(r.data);
        const firstInStock = r.data.variants?.find((v) => v.stock > 0);
        setSelectedVariantId(firstInStock?._id || r.data.variants?.[0]?._id || '');

        // Fetch related products from same category
        if (r.data.category?.slug) {
          api
            .get('/products', { params: { category: r.data.category.slug, limit: 4 } })
            .then((res) => {
              setRelatedProducts(res.data.products?.filter((p) => p._id !== r.data._id) || []);
            })
            .catch(() => setRelatedProducts([]));
        }
      })
      .catch(() => toast.error('Could not load product details'));
  }, [slug]);

  // Fetch reviews & wishlist status
  useEffect(() => {
    if (!product) return;

    api.get(`/reviews/product/${product._id}`).then((r) => setReviews(r.data)).catch(() => setReviews([]));

    if (!user) {
      try {
        const saved = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
        setInWishlist(saved.includes(product._id));
      } catch {
        setInWishlist(false);
      }
    }
  }, [product, user]);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        <div className="skeleton aspect-[4/5] w-full rounded-lg" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-28 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v._id === selectedVariantId) || product.variants?.[0];
  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const discount =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85'];

  const handleAddToCart = () => {
    if (!selectedVariant) return toast.error('Please select a size');
    addToCart(product._id, selectedVariant._id, qty, product);
  };

  const toggleWishlist = async () => {
    if (!user) {
      try {
        let saved = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
        if (saved.includes(product._id)) {
          saved = saved.filter((id) => id !== product._id);
          setInWishlist(false);
          toast.success('Removed from wishlist');
        } else {
          saved.push(product._id);
          setInWishlist(true);
          toast.success('Added to wishlist');
        }
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(saved));
      } catch {
        toast.error('Could not update wishlist');
      }
      return;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId: product._id });
      setInWishlist(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to post a verified review');
    if (!reviewForm.comment.trim()) return toast.error('Please write a brief comment');

    try {
      const res = await api.post('/reviews', { productId: product._id, ...reviewForm });
      setReviews(res.data);
      setReviewForm({ rating: 5, comment: '', reviewerName: '' });
      toast.success('Thank you! Your review has been submitted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-body">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 uppercase tracking-wider">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <FiChevronRight className="text-[10px]" />
        <Link to={`/category/${product.category?.slug || 'unstitched'}`} className="hover:text-gray-700">
          {product.category?.name || 'Collections'}
        </Link>
        <FiChevronRight className="text-[10px]" />
        <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div>
          {/* Main Display Image */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-100 group">
            <img
              src={images[activeImg] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-2.5 py-1 rounded tracking-wider uppercase shadow">
                -{discount}% OFF
              </span>
            )}
            {product.isNewArrival && (
              <span className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded tracking-wider uppercase shadow">
                NEW
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-24 rounded overflow-hidden border-2 transition-all shrink-0 ${
                    activeImg === i ? 'border-brand shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Form */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Category / Fabric label */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand uppercase tracking-[0.2em]">
              <span>{product.fabric || 'Luxury Fabric'}</span>
              {product.pieces && <span>&bull; {product.pieces} Piece Suit</span>}
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-950 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Rating / Review count */}
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={product.ratingAverage || 4.5} />
              <span className="text-xs text-gray-500 font-medium">
                {product.ratingAverage || '4.5'} ({product.ratingCount || reviews.length || 12} reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-4 p-3.5 bg-cream rounded-lg border border-brand/10">
              <span className="text-2xl sm:text-3xl font-bold text-brand">
                Rs. {product.price?.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    Rs. {product.compareAtPrice?.toLocaleString()}
                  </span>
                  <span className="text-xs bg-brand/10 text-brand font-bold px-2 py-0.5 rounded uppercase">
                    Save Rs. {(product.compareAtPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Urgency Stock Alert */}
            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-200">
                <FiInfo className="text-sm shrink-0" />
                <span>Hurry! Only <strong>{selectedVariant.stock} items left</strong> in stock for this selection.</span>
              </div>
            )}

            {/* Variant / Size Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider text-gray-900">
                  Select Size / Style:
                </span>
                <button
                  onClick={() => setSizeChartOpen(true)}
                  className="text-brand underline font-medium hover:text-brand-dark flex items-center gap-1"
                >
                  <span>Size & Fabric Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants?.map((v) => {
                  const isSelected = v._id === selectedVariantId;
                  const isSoldOut = v.stock <= 0;
                  return (
                    <button
                      key={v._id}
                      disabled={isSoldOut}
                      onClick={() => setSelectedVariantId(v._id)}
                      className={`text-xs px-4 py-2.5 rounded border font-semibold transition-all ${
                        isSelected
                          ? 'border-brand bg-brand text-white shadow'
                          : isSoldOut
                          ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed bg-gray-50'
                          : 'border-gray-300 text-gray-700 hover:border-brand hover:text-brand bg-white'
                      }`}
                    >
                      <span>{v.size}</span>
                      {v.color && <span className="text-[10px] opacity-80 block font-normal">{v.color}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag / Wishlist */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded h-12 w-32 justify-between px-2 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-500 hover:text-gray-900 text-base"
                >
                  -
                </button>
                <span className="font-bold text-sm text-gray-900">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="p-2 text-gray-500 hover:text-gray-900 text-base"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="prestige-button-black flex-1 h-12 gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingBag className="text-base" />
                <span>{outOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={toggleWishlist}
                className={`h-12 w-12 rounded border flex items-center justify-center text-lg transition-colors shrink-0 ${
                  inWishlist
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500 bg-white'
                }`}
                aria-label="Wishlist"
              >
                <FiHeart className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Value Guarantees for Pakistani Customers */}
            <div className="mt-8 border-t border-gray-200 pt-6 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center">
                <FiTruck className="text-xl text-brand mb-1" />
                <span className="text-[11px] font-semibold text-gray-900">2-4 Days Delivery</span>
                <span className="text-[10px] text-gray-500">Across Pakistan</span>
              </div>
              <div className="flex flex-col items-center">
                <FiShield className="text-xl text-brand mb-1" />
                <span className="text-[11px] font-semibold text-gray-900">100% Original</span>
                <span className="text-[10px] text-gray-500">Premium Fabric</span>
              </div>
              <div className="flex flex-col items-center">
                <FiRotateCcw className="text-xl text-brand mb-1" />
                <span className="text-[11px] font-semibold text-gray-900">7-Day Exchange</span>
                <span className="text-[10px] text-gray-500">Hassle-Free Policy</span>
              </div>
            </div>
          </div>

          {/* Accordion / Tabs Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex border-b border-gray-200 text-xs font-semibold uppercase tracking-wider">
              {['details', 'shipping', 'reviews'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-3 px-4 border-b-2 transition-all ${
                    activeTab === t ? 'border-brand text-brand font-bold' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {t === 'details' ? 'Product Specifications' : t === 'shipping' ? 'Delivery & Returns' : `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>

            <div className="py-4 text-xs text-gray-600 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li><strong>Fabric:</strong> {product.fabric || 'Premium Quality'}</li>
                    <li><strong>Suit Type:</strong> {product.pieces || 3} Piece Suit</li>
                    <li><strong>Design Style:</strong> Authentic Printed / Embroidered detail</li>
                    <li><strong>Care Instructions:</strong> Dry clean recommended or hand wash with gentle detergent. Avoid bleaching and direct sunlight.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p><strong>Shipping Times:</strong> Deliveries within Karachi, Lahore & Islamabad typically arrive in 2-3 business days. Other cities: 3-5 business days.</p>
                  <p><strong>Delivery Charges:</strong> FREE on orders above Rs. 3,000. Flat Rs. 250 across all other cities.</p>
                  <p><strong>Exchange Policy:</strong> Unused items with original tags can be exchanged within 7 days of delivery by contacting our WhatsApp support at 0300-0606664.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews list */}
                  {reviews.length === 0 ? (
                    <p className="text-gray-400 italic">No reviews yet. Be the first to review this design!</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100">
                      {reviews.map((r) => (
                        <div key={r._id} className="pt-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{r.user?.name || 'Customer'}</span>
                            <StarRating value={r.rating} />
                          </div>
                          <p className="mt-1 text-gray-600">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add review form */}
                  <form onSubmit={submitReview} className="p-4 bg-cream rounded-lg border border-brand/10 space-y-3">
                    <h4 className="font-heading font-semibold text-gray-900 uppercase tracking-wider">Leave a Review</h4>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Your Rating</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="input text-xs py-1"
                      >
                        <option value={5}>5 Stars - Excellent Fabric & Stitch</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Below Expectations</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Feedback / Comment</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows={2}
                        placeholder="Share your thoughts about the fabric softness, color accuracy, and stitching..."
                        className="input text-xs"
                      />
                    </div>
                    <button type="submit" className="btn-primary text-xs uppercase tracking-wider py-2">
                      Submit Verified Review
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-gray-900">
              You May Also Like
            </h2>
            <Link
              to={`/category/${product.category?.slug || 'unstitched'}`}
              className="text-xs font-semibold text-brand uppercase tracking-wider hover:underline"
            >
              View Full Collection &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size & Fabric Guide Modal */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSizeChartOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-heading font-bold text-lg text-gray-900 uppercase tracking-wider">
                Size & Fabric Dimensions Guide
              </h3>
              <button onClick={() => setSizeChartOpen(false)} className="text-gray-500 hover:text-gray-900 text-lg">
                &times;
              </button>
            </div>
            <div className="text-xs space-y-4 text-gray-700">
              <p><strong>Unstitched Fabric Breakdown:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Shirt Fabric: 3.0 Meters (approx. 58" width)</li>
                <li>Dupatta / Shawl: 2.5 Meters</li>
                <li>Trouser / Shalwar: 2.5 Meters</li>
              </ul>
              <p className="pt-2"><strong>Standard Pret Stitched Sizing (Inches):</strong></p>
              <div className="border rounded overflow-hidden">
                <table className="w-full text-center divide-y divide-gray-200">
                  <thead className="bg-gray-50 font-bold">
                    <tr>
                      <th className="p-2">Size</th>
                      <th className="p-2">Chest</th>
                      <th className="p-2">Waist</th>
                      <th className="p-2">Hips</th>
                      <th className="p-2">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="p-2 font-semibold">Small</td><td>38"</td><td>35"</td><td>41"</td><td>39"</td></tr>
                    <tr><td className="p-2 font-semibold">Medium</td><td>41"</td><td>38"</td><td>44"</td><td>40"</td></tr>
                    <tr><td className="p-2 font-semibold">Large</td><td>44"</td><td>42"</td><td>48"</td><td>41"</td></tr>
                    <tr><td className="p-2 font-semibold">XL</td><td>47"</td><td>45"</td><td>51"</td><td>42"</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <button onClick={() => setSizeChartOpen(false)} className="btn-primary w-full mt-5 text-xs py-2 uppercase">
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
