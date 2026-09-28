import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Jute Handcraft', path: '/shop?category=JUTE+HANDCRAFT' },
  { label: 'Tufting Rugs', path: '/shop?category=TUFTING+RUGS' },
  { label: 'Custom Rug', path: '/custom-rug' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-charcoal-900 text-cream/80 text-center py-2.5 px-4 text-[11px] tracking-[0.2em] uppercase">
        Free shipping within Bangladesh — Custom rugs crafted in 4–8 weeks
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-cream/80 backdrop-blur-sm py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-8">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-charcoal-800"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-display text-2xl lg:text-[28px] tracking-wide text-charcoal-900 leading-none font-bold">
              Crafting <span className="text-accent">&</span> Tufting
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.slice(0, 5).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[12px] tracking-[0.18em] uppercase text-charcoal-700 hover:text-accent transition-colors duration-300 relative group py-1"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <button className="hidden sm:block text-charcoal-700 hover:text-accent transition-colors" aria-label="Search">
              <Search size={19} />
            </button>

            {/* User / Account */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-charcoal-700 hover:text-accent transition-colors flex items-center gap-1.5"
                  aria-label="Account menu"
                >
                  <User size={19} />
                  <span className="hidden xl:inline text-xs tracking-[0.1em] uppercase">
                    {(user.user_metadata?.full_name as string)?.split(' ')[0] || 'Account'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 bg-white border border-sand-100 shadow-lg min-w-[180px] py-2 animate-fade-in">
                    <Link to="/account" className="block px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                      My Account
                    </Link>
                    <Link to="/account" className="block px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                      My Orders
                    </Link>
                    <Link to="/custom-rug" className="block px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                      Custom Designs
                    </Link>
                    <div className="border-t border-sand-100 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="text-charcoal-700 hover:text-accent transition-colors" aria-label="Sign In">
                <User size={19} />
              </Link>
            )}

            <Link to="/account" className="hidden sm:block text-charcoal-700 hover:text-accent transition-colors" aria-label="Wishlist">
              <Heart size={19} />
            </Link>
            <Link to="/cart" className="relative text-charcoal-700 hover:text-accent transition-colors" aria-label="Cart">
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-cream text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/custom-rug" className="hidden lg:inline-flex btn-primary !py-2.5 !px-5 !text-[11px]">
              Create Your Rug
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-0 bg-cream z-40 animate-fade-in pt-24 px-8 overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-display text-3xl text-charcoal-900 hover:text-accent py-3 border-b border-sand-100 transition-colors font-semibold"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link to="/account" className="font-display text-2xl text-accent py-3 border-b border-sand-100 transition-colors">
                    My Account
                  </Link>
                  <button onClick={handleSignOut} className="text-left font-display text-2xl text-red-600 py-3 border-b border-sand-100">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/signin" className="font-display text-2xl text-accent py-3 border-b border-sand-100 transition-colors">
                  Sign In / Sign Up
                </Link>
              )}

              <Link to="/custom-rug" className="btn-primary mt-6 w-full">
                Create Your Rug
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
