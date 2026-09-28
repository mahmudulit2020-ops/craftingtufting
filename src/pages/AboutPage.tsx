import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Leaf, Award } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/33484684/pexels-photo-33484684.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1920"
          alt="Rug workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/50" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            <p className="text-cream/70 text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
            <h1 className="font-display text-display-lg text-cream">The Art of Handcraft</h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-20 lg:py-32">
        <Reveal>
          <p className="section-label mb-4 text-center">Crafting & Tufting</p>
          <h2 className="font-display text-display-md text-charcoal-900 text-center mb-8">
            Rugs Made by Hand, Designed by You
          </h2>
          <div className="space-y-6 text-charcoal-600 leading-relaxed text-lg">
            <p>
              Crafting & Tufting was born from a simple belief: a rug should be
              as unique as the space it lives in. Every rug we make is handcrafted
              by skilled artisans who have spent years perfecting their craft.
            </p>
            <p>
              We work with two traditions — natural jute handweaving and artistic
              hand-tufting. Each piece begins with raw materials: jute fibers
              from Bangladesh, premium wool, and bamboo silk. Through patient,
              skilled work, these materials become something more.
            </p>
            <p>
              Our Custom Rug Studio lets you take control. Choose your shape,
              measure your space, select or upload a design, and see your price
              instantly. No waiting for quotes, no back-and-forth. Just you,
              your vision, and our craftsmanship.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="bg-sand-50 py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Handcrafted', desc: 'Every rug is made by hand by skilled artisans — never mass-produced.' },
              { icon: Leaf, title: 'Natural Materials', desc: 'We use jute, wool, and bamboo silk — sustainable and premium.' },
              { icon: Sparkles, title: 'Custom Made', desc: 'Designed to your exact measurements, colors, and preferences.' },
              { icon: Award, title: 'Quality First', desc: 'Each piece is inspected and quality-checked before delivery.' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-sand-200 flex items-center justify-center text-accent">
                    <v.icon size={24} />
                  </div>
                  <h3 className="font-display text-xl text-charcoal-900 mb-3">{v.title}</h3>
                  <p className="text-sm text-charcoal-500 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 text-center max-w-2xl mx-auto px-6">
        <Reveal>
          <h2 className="font-display text-display-md text-charcoal-900 mb-6">Ready to Create Yours?</h2>
          <p className="text-charcoal-500 mb-8">Design a custom rug measured precisely for your space, or explore our handcrafted collections.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/custom-rug" className="btn-primary">Create Custom Rug <ArrowRight size={16} /></Link>
            <Link to="/shop" className="btn-secondary">Shop Collection</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
