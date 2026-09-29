import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  Check,
  Ruler,
  Truck,
  Heart,
  ShieldCheck,
  Leaf,
} from 'lucide-react';
import { fetchProductBySlug, fetchProductSizes } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import type { Product, ProductSize } from '@/lib/types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping' | 'care'>('details');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        if (p) {
          fetchProductSizes(p.id).then((s) => {
            setSizes(s);
            setSelectedSize(s[0] || null);
          });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-charcoal-900 mb-4">Artisan Rug Not Found</h1>
        <p className="text-xs text-charcoal-500 mb-6">The requested piece may have been archived or sold out.</p>
        <Link to="/shop" className="btn-primary">Browse All Collections</Link>
      </div>
    );
  }

  const currentPrice = (selectedSize ? selectedSize.price : product.base_price) * quantity;
  const isFav = isWishlisted(product.id);
  const gallery = product.gallery?.length ? product.gallery : [product.image_url];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: `${product.id}-${selectedSize.id}`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: selectedSize.label,
      quantity,
      price: selectedSize.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addItem({
      id: `${product.id}-${selectedSize.id}`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: selectedSize.label,
      quantity,
      price: selectedSize.price,
    });
    navigate('/checkout');
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-charcoal-500 hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] bg-sand-100 overflow-hidden relative border border-sand-200">
              <img
                src={gallery[activeImage] || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 shadow-md ${
                  isFav
                    ? 'bg-terracotta text-cream'
                    : 'bg-white/80 backdrop-blur-sm text-charcoal-800 hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 border transition-all overflow-hidden ${
                      activeImage === idx
                        ? 'border-charcoal-900 ring-2 ring-charcoal-900/10'
                        : 'border-sand-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Checkout Action */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-accent font-semibold mb-2">
                <span>{product.category}</span>
                {product.subCategory && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{product.subCategory}</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-charcoal-900 font-bold mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl font-bold text-charcoal-900">
                  {formatPrice(currentPrice)}
                </span>
                <span className="text-xs tracking-wider uppercase text-emerald-700 font-medium">
                  {product.stock_status}
                </span>
              </div>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed pt-3 border-t border-sand-200">
              {product.description}
            </p>

            {/* Size Dimension Picker */}
            {sizes.length > 0 && (
              <div className="pt-4 border-t border-sand-200">
                <div className="flex justify-between items-baseline mb-2.5">
                  <label className="text-xs tracking-[0.15em] uppercase text-charcoal-700 font-semibold">
                    Select Dimensions
                  </label>
                  <Link
                    to="/custom-rug"
                    className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    <Ruler size={13} /> Need a custom size?
                  </Link>
                </div>

                <div className="space-y-2">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s)}
                      className={`w-full p-3.5 text-xs text-left border flex items-center justify-between transition-all ${
                        selectedSize?.id === s.id
                          ? 'border-charcoal-900 bg-sand-100 ring-1 ring-charcoal-900 font-semibold'
                          : 'border-sand-200 bg-white hover:border-sand-400'
                      }`}
                    >
                      <span className="text-charcoal-900">{s.label}</span>
                      <span className="font-display text-sm text-charcoal-900">
                        {formatPrice(s.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs tracking-[0.15em] uppercase text-charcoal-600 font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-sand-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-charcoal-600 hover:text-charcoal-900 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-semibold text-charcoal-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-charcoal-600 hover:text-charcoal-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart — {formatPrice(currentPrice)}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full btn-accent !py-4 flex items-center justify-center gap-2"
              >
                <Zap size={16} /> Instant Checkout
              </button>
            </div>

            {/* Trust and Artisan Guarantee Badges */}
            <div className="pt-6 border-t border-sand-200 space-y-2.5 text-xs text-charcoal-600">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-accent" />
                <span>Handcrafted in Bangladesh by master weavers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-accent" />
                <span>Insured worldwide express air shipping with live tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Leaf size={16} className="text-accent" />
                <span>Zero synthetic volatile adhesives · 100% natural backing</span>
              </div>
            </div>

            {/* Tabbed Info */}
            <div className="pt-6 border-t border-sand-200">
              <div className="flex border-b border-sand-200 gap-6 text-xs uppercase tracking-wider font-semibold">
                {(['details', 'materials', 'shipping', 'care'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2.5 transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'border-accent text-accent font-bold'
                        : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
                    }`}
                  >
                    {tab === 'details'
                      ? 'Story'
                      : tab === 'materials'
                      ? 'Fibers'
                      : tab === 'shipping'
                      ? 'Delivery'
                      : 'Care'}
                  </button>
                ))}
              </div>

              <div className="pt-4 text-xs text-charcoal-600 leading-relaxed">
                {activeTab === 'details' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'materials' && (
                  <div>
                    <p className="font-semibold text-charcoal-800 mb-1">Primary Fiber:</p>
                    <p className="mb-2">{product.material}</p>
                    <p className="font-semibold text-charcoal-800 mb-1">Production Technique:</p>
                    <p>{product.production_info}</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div>
                    <p className="mb-2">{product.shipping_info}</p>
                    <p>Orders are dispatched in moisture-sealed tubes with courier tracking numbers.</p>
                  </div>
                )}
                {activeTab === 'care' && (
                  <p>{product.care_info}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
