import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Zap, Check, Ruler, Truck, Sparkles } from 'lucide-react';
import { fetchProductBySlug, fetchProductSizes } from '@/lib/api';
import { formatCurrency } from '@/lib/pricing';
import { useCart } from '@/context/CartContext';
import type { Product, ProductSize } from '@/lib/types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);

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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addItem({
      id: `${product.id}-${selectedSize.id}`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: selectedSize.label,
      quantity: 1,
      price: selectedSize.price,
    });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!product || !selectedSize) return;
    addItem({
      id: `${product.id}-${selectedSize.id}`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: selectedSize.label,
      quantity: 1,
      price: selectedSize.price,
    });
    navigate('/checkout');
  };

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
        <h1 className="font-display text-3xl text-charcoal-900 mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image_url];

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-charcoal-500 hover:text-accent transition-colors">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div>
            <div
              className="relative overflow-hidden bg-sand-50 aspect-square cursor-zoom-in mb-4"
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
            >
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${zoomed ? 'scale-150' : 'scale-100'}`}
              />
              {product.stock_status === 'Made to Order' && (
                <span className="absolute top-4 left-4 bg-cream/90 backdrop-blur-sm text-charcoal-800 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
                  Made to Order
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 overflow-hidden bg-sand-50 transition-all ${activeImage === i ? 'ring-2 ring-accent' : 'ring-1 ring-sand-100 hover:ring-sand-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:py-4">
            <p className="text-xs tracking-[0.2em] uppercase text-accent mb-3">{product.category}</p>
            <h1 className="font-display text-4xl lg:text-5xl text-charcoal-900 mb-4">{product.name}</h1>
            <p className="text-sm text-charcoal-500 mb-6">{product.material}</p>

            <div className="flex items-baseline gap-4 mb-8">
              {selectedSize && (
                <span className="font-display text-3xl text-charcoal-900">
                  {formatCurrency(selectedSize.price)}
                </span>
              )}
              <span className={`text-sm ${product.stock_status === 'In Stock' ? 'text-green-700' : 'text-accent'}`}>
                ● {product.stock_status}
              </span>
            </div>

            <p className="text-charcoal-600 leading-relaxed mb-8">{product.description}</p>

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-4">Select Size</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 text-xs text-center transition-all ${selectedSize?.id === size.id ? 'bg-charcoal-800 text-cream' : 'bg-white border border-sand-200 text-charcoal-700 hover:border-sand-400'}`}
                    >
                      {size.label}
                      <span className="block text-[10px] mt-1 opacity-60">{formatCurrency(size.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} className="btn-secondary flex-1">
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="btn-primary flex-1">
                <Zap size={16} /> Buy Now
              </button>
            </div>

            {/* Custom CTA */}
            <div className="bg-sand-50 p-6 mb-8 border-l-4 border-accent">
              <p className="text-sm text-charcoal-700 mb-3">Need a different size or design?</p>
              <Link to="/custom-rug" className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-accent hover:gap-4 transition-all">
                Create Custom Version <Sparkles size={16} />
              </Link>
            </div>

            {/* Info sections */}
            <div className="space-y-6 border-t border-sand-100 pt-8">
              {product.care_info && (
                <div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Care Instructions</h3>
                  <p className="text-sm text-charcoal-700 leading-relaxed">{product.care_info}</p>
                </div>
              )}
              {product.production_info && (
                <div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Production</h3>
                  <p className="text-sm text-charcoal-700 leading-relaxed">{product.production_info}</p>
                </div>
              )}
              {product.shipping_info && (
                <div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Shipping</h3>
                  <p className="text-sm text-charcoal-700 leading-relaxed">{product.shipping_info}</p>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-sand-100">
              <div className="text-center">
                <Check size={20} className="text-accent mx-auto mb-2" />
                <p className="text-[10px] tracking-[0.1em] uppercase text-charcoal-500">Quality Checked</p>
              </div>
              <div className="text-center">
                <Ruler size={20} className="text-accent mx-auto mb-2" />
                <p className="text-[10px] tracking-[0.1em] uppercase text-charcoal-500">Custom Sizes</p>
              </div>
              <div className="text-center">
                <Truck size={20} className="text-accent mx-auto mb-2" />
                <p className="text-[10px] tracking-[0.1em] uppercase text-charcoal-500">Free Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
