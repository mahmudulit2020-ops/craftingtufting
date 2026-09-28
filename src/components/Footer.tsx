import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream/70">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl text-cream mb-4">
              Crafting <span className="text-accent-light">&</span> Tufting
            </h3>
            <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
              Handcrafted rugs designed your way. Premium materials, artisanal
              craftsmanship, and custom designs made precisely for your space.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-cream/50 hover:text-accent-light transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-cream/50 hover:text-accent-light transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="mailto:hello@craftingtufting.com" className="text-cream/50 hover:text-accent-light transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-cream/90 mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-accent-light transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=JUTE+HANDCRAFT" className="hover:text-accent-light transition-colors">Jute Handcraft</Link></li>
              <li><Link to="/shop?category=TUFTING+RUGS" className="hover:text-accent-light transition-colors">Tufting Rugs</Link></li>
              <li><Link to="/shop?category=READY-MADE" className="hover:text-accent-light transition-colors">Ready-Made</Link></li>
              <li><Link to="/shop?category=CUSTOM" className="hover:text-accent-light transition-colors">Custom Rugs</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-cream/90 mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-accent-light transition-colors">About Us</Link></li>
              <li><Link to="/custom-rug" className="hover:text-accent-light transition-colors">Custom Rug Studio</Link></li>
              <li><Link to="/contact" className="hover:text-accent-light transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-accent-light transition-colors">FAQ</Link></li>
              <li><Link to="/admin" className="hover:text-accent-light transition-colors">Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-cream/90 mb-5">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-accent-light flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-accent-light flex-shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-accent-light flex-shrink-0" />
                <span>hello@craftingtufting.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Crafting & Tufting. All rights reserved.
          </p>
          <p className="text-xs text-cream/40">
            Handcrafted with care in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
