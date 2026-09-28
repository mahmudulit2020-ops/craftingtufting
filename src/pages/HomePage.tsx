import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Ruler, Palette, Calculator, Truck, CheckCircle2, Star, ChevronDown } from 'lucide-react';
import Reveal from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, fetchCustomDesigns } from '@/lib/api';
import type { Product, CustomDesign } from '@/lib/types';

const heroImage = 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920';
const juteImage = 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const tuftingImage = 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000';
const customSectionImage = 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1400';

const reviews = [
  { author: 'Sarah K.', text: 'The custom tufted rug exceeded my expectations. The craftsmanship is extraordinary and it fits my living room perfectly.', rating: 5, location: 'Dhaka' },
  { author: 'Michael R.', text: 'I designed my own rug with the online studio — measured it, picked colors, and got an instant price. Seamless experience.', rating: 5, location: 'Chattogram' },
  { author: 'Aisha T.', text: 'The jute rug quality is exceptional. Warm, natural, and beautifully handwoven. Worth every taka.', rating: 5, location: 'Sylhet' },
];

const faqs = [
  { q: 'How does the custom rug process work?', a: 'Choose your rug type, shape, and measurements in our Custom Rug Studio. Select or upload a design, customize colors, add optional features, and get an instant price. Pay 50% advance to confirm your order, and we craft your rug in 4–8 weeks.' },
  { q: 'Why is 50% advance required?', a: 'The 50% advance confirms your order and covers materials and initial production costs. Since each custom rug is handmade to your exact specifications, the advance ensures commitment before crafting begins. The remaining 50% is due per the agreed terms.' },
  { q: 'How long does production take?', a: 'Jute handcraft rugs take 2–3 weeks. Tufting rugs take 4–6 weeks for standard designs and 6–8 weeks for complex or made-to-order pieces. Rush production is available as an add-on.' },
  { q: 'Can I upload my own design?', a: 'Yes. In the Custom Rug Studio you can upload PNG, JPG, WEBP, or PDF files. We review your artwork and may contact you to ensure the design translates well to a hand-tufted rug.' },
  { q: 'Do you ship internationally?', a: 'We currently ship within Bangladesh. International shipping is coming soon — our architecture supports global delivery and multiple currencies for future expansion.' },
  { q: 'What payment methods do you accept?', a: 'We accept bKash, Nagad, bank transfer, and card/online payments. Additional international gateways will be added as we expand.' },
];

const steps = [
  { icon: Palette, title: 'Choose a Design', desc: 'Browse our library or upload your own artwork' },
  { icon: Ruler, title: 'Measure Your Space', desc: 'Enter precise dimensions in any unit' },
  { icon: Calculator, title: 'Get Instant Price', desc: 'Live pricing updates as you customize' },
  { icon: CheckCircle2, title: 'Pay 50% Advance', desc: 'Confirm your order and production begins' },
  { icon: Truck, title: 'We Craft Your Rug', desc: 'Handmade by artisans, delivered to your door' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [designs, setDesigns] = useState<CustomDesign[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {});
    fetchCustomDesigns().then(setDesigns).catch(() => {});
  }, []);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const galleryDesigns = designs.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: 'scale(1.08)',
            transition: 'transform 8s ease-out',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/40 via-charcoal-900/30 to-charcoal-900/60" />

        <div className="relative h-full flex items-center max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-cream/70 text-xs tracking-[0.3em] uppercase mb-6 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              Handcrafted Rugs — Designed Your Way
            </p>
            <h1 className="font-display text-display-xl text-cream leading-[1.05] animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
              Your Space.<br />
              Your Design.<br />
              <span className="text-sand-200">Your Rug.</span>
            </h1>
            <p className="text-cream/80 text-lg max-w-lg mt-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.45s', opacity: 0 }}>
              Choose from our handcrafted collections or create a custom rug
              measured precisely for your space.
            </p>
            <div className="flex flex-wrap gap-4 mt-10 animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
              <Link to="/custom-rug" className="btn-primary !bg-cream !text-charcoal-900 hover:!bg-sand-100">
                Create Your Custom Rug <ArrowRight size={16} />
              </Link>
              <Link to="/shop" className="btn-secondary !border-cream/40 !text-cream hover:!bg-cream hover:!text-charcoal-900">
                Shop Ready-Made Rugs
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 lg:py-32 max-w-[1440px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="section-label mb-4">Our Collections</p>
          <h2 className="font-display text-display-lg text-charcoal-900">Two Craft Traditions</h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <Reveal>
            <Link to="/shop?category=JUTE+HANDCRAFT" className="group block relative overflow-hidden aspect-[4/5]">
              <img src={juteImage} alt="Jute Handcraft" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-cream">
                <p className="text-xs tracking-[0.25em] uppercase text-sand-200 mb-3">Natural · Handwoven</p>
                <h3 className="font-display text-4xl lg:text-5xl mb-3">Jute Handcraft</h3>
                <p className="text-cream/80 max-w-md mb-6">Organic, earthy textures handwoven from natural jute fibers.</p>
                <span className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase border-b border-cream/40 pb-1 group-hover:gap-4 transition-all">
                  Explore Collection <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={150}>
            <Link to="/shop?category=TUFTING+RUGS" className="group block relative overflow-hidden aspect-[4/5]">
              <img src={tuftingImage} alt="Tufting Rugs" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-cream">
                <p className="text-xs tracking-[0.25em] uppercase text-sand-200 mb-3">Artistic · Hand-tufted</p>
                <h3 className="font-display text-4xl lg:text-5xl mb-3">Tufting Rugs</h3>
                <p className="text-cream/80 max-w-md mb-6">Custom artistic rugs with plush pile and carved detail.</p>
                <span className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase border-b border-cream/40 pb-1 group-hover:gap-4 transition-all">
                  Explore Collection <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Custom Rug Highlight */}
      <section className="relative py-20 lg:py-32 bg-charcoal-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={customSectionImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-transparent" />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-sand-300 mb-6">The Crafting & Tufting Studio</p>
              <h2 className="font-display text-display-lg text-cream mb-6">
                Measure. Design.<br />Customize. Order.
              </h2>
              <p className="text-cream/70 text-lg leading-relaxed mb-10">
                Design your custom rug from start to finish — choose shape,
                enter measurements, pick or upload a design, customize colors,
                and see your estimated price instantly. No back-and-forth,
                no waiting for quotes.
              </p>
              <Link to="/custom-rug" className="btn-primary !bg-cream !text-charcoal-900 hover:!bg-sand-100">
                Start Custom Design <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 max-w-[1440px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="section-label mb-4">The Process</p>
          <h2 className="font-display text-display-lg text-charcoal-900">How It Works</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-sand-200 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-cream group-hover:border-accent transition-all duration-500">
                  <step.icon size={24} />
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-accent mb-2">Step {i + 1}</p>
                <h3 className="font-display text-xl text-charcoal-900 mb-2">{step.title}</h3>
                <p className="text-sm text-charcoal-500 leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Ready-Made Rugs */}
      {featuredProducts.length > 0 && (
        <section className="py-20 lg:py-32 bg-sand-50">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
            <Reveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
              <div>
                <p className="section-label mb-4">Featured Rugs</p>
                <h2 className="font-display text-display-lg text-charcoal-900">Ready-Made Selection</h2>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-charcoal-700 hover:text-accent transition-colors border-b border-charcoal-300 pb-1">
                View All <ArrowRight size={16} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product, i) => (
                <Reveal key={product.id} delay={i * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Design Gallery */}
      {galleryDesigns.length > 0 && (
        <section className="py-20 lg:py-32 max-w-[1440px] mx-auto px-6 lg:px-10">
          <Reveal className="text-center mb-16">
            <p className="section-label mb-4">Design Library</p>
            <h2 className="font-display text-display-lg text-charcoal-900">Custom Design Gallery</h2>
            <p className="text-charcoal-500 max-w-xl mx-auto mt-4">Browse our curated design library or upload your own artwork in the Custom Rug Studio.</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryDesigns.map((design, i) => (
              <Reveal key={design.id} delay={i * 60}>
                <Link to="/custom-rug" className="group block">
                  <div className="relative overflow-hidden aspect-square bg-sand-50 mb-3">
                    <img src={design.image_url} alt={design.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/20 transition-colors duration-500" />
                  </div>
                  <p className="text-xs text-charcoal-700 group-hover:text-accent transition-colors">{design.name}</p>
                  <p className="text-[10px] text-charcoal-400 uppercase tracking-wider">{design.category}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Why Crafting & Tufting */}
      <section className="py-20 lg:py-32 bg-sand-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <Reveal className="text-center mb-16">
            <p className="section-label mb-4">Why Choose Us</p>
            <h2 className="font-display text-display-lg text-charcoal-900">The Crafting & Tufting Difference</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { title: 'Handcrafted', desc: 'Every rug is made by skilled artisans, never mass-produced.' },
              { title: 'Custom Made', desc: 'Designed to your exact measurements and preferences.' },
              { title: 'Premium Materials', desc: 'Only the finest wool, jute, and bamboo silk.' },
              { title: 'Quality Checked', desc: 'Each piece is inspected before it reaches your door.' },
              { title: 'Made for Your Space', desc: 'A rug that fits perfectly — because you designed it.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="text-center">
                  <div className="w-12 h-px bg-accent mx-auto mb-6" />
                  <h3 className="font-display text-xl text-charcoal-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-charcoal-500 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 lg:py-32 max-w-[1440px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="section-label mb-4">Testimonials</p>
          <h2 className="font-display text-display-lg text-charcoal-900">What Our Customers Say</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Reveal key={review.author} delay={i * 120}>
              <div className="bg-cream border border-sand-100 p-8 lg:p-10 h-full flex flex-col">
                <div className="flex gap-1 mb-6 text-accent">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="font-display text-xl text-charcoal-800 leading-relaxed italic mb-6 flex-1">
                  "{review.text}"
                </p>
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{review.author}</p>
                  <p className="text-xs text-charcoal-400">{review.location}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 bg-sand-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <Reveal className="text-center mb-16">
            <p className="section-label mb-4">Questions</p>
            <h2 className="font-display text-display-lg text-charcoal-900">Frequently Asked</h2>
          </Reveal>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <Reveal key={i}>
                <div className="border-b border-sand-200">
                  <button
                    className="w-full text-left py-6 flex justify-between items-center gap-4 group"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-display text-lg text-charcoal-900 group-hover:text-accent transition-colors">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-charcoal-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${openFaq === i ? 'max-h-60 pb-6' : 'max-h-0'}`}>
                    <p className="text-sm text-charcoal-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 lg:py-28 bg-charcoal-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <p className="section-label mb-4 !text-sand-300">Stay Connected</p>
            <h2 className="font-display text-display-md text-cream mb-4">Join Our Newsletter</h2>
            <p className="text-cream/60 mb-8">Be the first to know about new collections, custom design features, and artisan stories.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-cream/20 text-cream px-5 py-3.5 text-sm outline-none focus:border-accent-light transition-colors placeholder:text-cream/40"
              />
              <button className="btn-primary !bg-cream !text-charcoal-900 hover:!bg-sand-100 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
