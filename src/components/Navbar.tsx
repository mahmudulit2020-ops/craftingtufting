import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Globe,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, type CurrencyCode } from '@/context/CurrencyContext';
import { useLanguage, type LanguageCode } from '@/context/LanguageContext';
import SearchModal from './SearchModal';
import BrandLogo from './common/BrandLogo';

export default function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { currency, setCurrency, allCurrencies, currentCurrencyConfig } = useCurrency();
  const { language, setLanguage, allLanguages, currentLanguageConfig, t } = useLanguage();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const navLinks = [
    { label: t('shopRugs', 'Shop Rugs'), path: '/shop?category=TUFTING+RUGS' },
    { label: t('customRugStudio', 'Custom Rug Studio'), path: '/custom-rug', highlight: true },
    { label: t('tuftingSupplies', 'Tufting Supplies'), path: '/tufting-supplies' },
    { label: t('juteHandicrafts', 'Jute Handicrafts'), path: '/jute-handicrafts' },
    { label: t('trackOrder', 'Track Order'), path: '/track-order' },
    { label: t('aboutAtelier', 'About Atelier'), path: '/about' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setCurrencyDropdownOpen(false);
    setLanguageDropdownOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar with Language, Centered Large Logo, and Currency (Slightly dark background) */}
      <div className="bg-[#D2C8B7] text-[#14181F] text-xs py-3 px-4 sm:px-6 lg:px-10 border-b border-[#BCB19F] relative z-50 shadow-xs">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-3 items-center gap-4">
          {/* Left: Atelier Dispatch Notice */}
          <div className="hidden md:flex items-center text-[11px] tracking-[0.15em] uppercase font-bold text-[#2A2F38] truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2 shrink-0 animate-pulse" />
            <span className="truncate">
              {t('announcement', 'Handcrafted in Bangladesh · Worldwide Express Delivery')}
            </span>
          </div>

          {/* Center: Brand Logo (Significantly Larger, Clearer & Eye-Catching Dark Color) */}
          <div className="col-span-1 flex items-center justify-start md:justify-center">
            <BrandLogo variant="dark" size="md" />
          </div>

          {/* Right: Language, Currency & Quick Links with Completely Clear & Legible Icons */}
          <div className="col-span-1 flex items-center justify-end gap-2.5 sm:gap-3.5 text-[11px]">
            {/* Language Switcher - High Contrast & Completely Clear */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLanguageDropdownOpen(!languageDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-[#12151B] hover:bg-[#1C2028] text-white px-2.5 sm:px-3 py-1.5 rounded-sm border border-[#0A0C0E] shadow-sm transition-all duration-150 active:scale-95 font-semibold text-[11px]"
                aria-label="Select Language"
              >
                <Languages size={15} className="text-amber-400 shrink-0" />
                <span className="text-sm leading-none">{currentLanguageConfig.flag}</span>
                <span className="uppercase tracking-wider font-bold text-white text-[11px]">{currentLanguageConfig.code}</span>
                <ChevronDown size={12} className="text-amber-400 shrink-0" />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#12151B] border border-amber-500/30 shadow-2xl py-1.5 min-w-[170px] z-50 animate-fade-in text-left rounded-sm">
                  {allLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[11px] flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </span>
                      <span className="font-mono text-amber-400 text-[10px] uppercase font-bold">{l.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Switcher - High Contrast & Completely Clear */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLanguageDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-[#12151B] hover:bg-[#1C2028] text-white px-2.5 sm:px-3 py-1.5 rounded-sm border border-[#0A0C0E] shadow-sm transition-all duration-150 active:scale-95 font-semibold text-[11px]"
                aria-label="Select Currency"
              >
                <Globe size={15} className="text-amber-400 shrink-0" />
                <span className="font-mono font-bold tracking-wider text-white text-[11px]">{currency}</span>
                <span className="text-amber-300 font-bold text-[11px]">({currentCurrencyConfig.symbol})</span>
                <ChevronDown size={12} className="text-amber-400 shrink-0" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#12151B] border border-amber-500/30 shadow-2xl py-1.5 min-w-[170px] z-50 animate-fade-in text-left rounded-sm">
                  {allCurrencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as CurrencyCode);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[11px] flex items-center justify-between transition-colors ${
                        currency === c.code
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{c.code} — {c.name}</span>
                      <span className="font-mono text-amber-300 font-bold">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[#9C9281] hidden md:inline">|</span>

            <Link
              to="/track-order"
              className="hidden md:inline-block hover:text-amber-800 transition-colors tracking-wider uppercase text-[10.5px] font-bold text-[#1F2530]"
            >
              {t('trackOrder', 'Order Tracking')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation Bar (Lower Line with slightly dark background & high contrast) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#DDD5C7]/95 backdrop-blur-md shadow-md py-2.5 border-b border-[#BCB19F]'
            : 'bg-[#DDD5C7] py-3.5 border-b border-[#BCB19F]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-[#11141A] p-1.5 rounded-sm hover:bg-black/10 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop Nav Links - Arranged & Partitioned by Size with dark, bold high-contrast text */}
          <nav className="hidden lg:flex items-center flex-1 justify-start xl:justify-between gap-2 xl:gap-3 pr-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11.5px] xl:text-xs tracking-[0.14em] uppercase transition-all duration-200 relative group px-3.5 py-1.5 rounded-sm whitespace-nowrap ${
                  link.highlight
                    ? 'bg-[#C89B3C]/20 text-[#78350F] font-black border-2 border-[#92400E] shadow-xs hover:bg-[#C89B3C]/30'
                    : 'text-[#12151B] hover:text-black hover:bg-black/8 font-bold'
                }`}
              >
                <span>{link.label}</span>
                {!link.highlight && (
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] bg-[#12151B] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons - High Contrast Dark Color */}
          <div className="flex items-center gap-3.5 sm:gap-4.5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-[#12151B] hover:text-[#92400E] hover:scale-110 transition-all p-1.5 rounded-sm hover:bg-black/5"
              aria-label="Search catalog"
            >
              <Search size={20} className="stroke-[2.2]" />
            </button>

            {/* Wishlist Link with Badge */}
            <Link
              to="/wishlist"
              className="relative text-[#12151B] hover:text-[#92400E] hover:scale-110 transition-all p-1.5 rounded-sm hover:bg-black/5"
              aria-label="Wishlist"
            >
              <Heart size={20} className="stroke-[2.2]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User / Account Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-[#12151B] hover:text-[#92400E] transition-all flex items-center gap-1.5 p-1.5 rounded-sm hover:bg-black/5"
                  aria-label="Account menu"
                >
                  <User size={20} className="stroke-[2.2]" />
                  <span className="hidden xl:inline text-xs tracking-wider uppercase font-bold text-[#12151B]">
                    {(user.user_metadata?.full_name as string)?.split(' ')[0] || 'Account'}
                  </span>
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="text-[#12151B] hover:text-[#92400E] hover:scale-110 transition-all p-1.5 rounded-sm hover:bg-black/5"
                  aria-label="Sign In"
                >
                  <User size={20} className="stroke-[2.2]" />
                </Link>
              )}

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-sand-200 shadow-xl min-w-[200px] py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-sand-100">
                    <p className="font-semibold text-charcoal-900 truncate">
                      {user?.user_metadata?.full_name || 'Artisan Client'}
                    </p>
                    <p className="text-[11px] text-charcoal-500 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/account"
                    className="block px-4 py-2.5 text-charcoal-700 hover:bg-sand-50 transition-colors"
                  >
                    Client Dashboard
                  </Link>
                  <Link
                    to="/track-order"
                    className="block px-4 py-2.5 text-charcoal-700 hover:bg-sand-50 transition-colors"
                  >
                    Track Custom Orders
                  </Link>
                  <Link
                    to="/admin"
                    className="block px-4 py-2.5 text-accent font-semibold hover:bg-sand-50 transition-colors"
                  >
                    Admin Atelier Console
                  </Link>

                  <div className="border-t border-sand-100 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Link - High Contrast */}
            <Link
              to="/cart"
              className="relative text-[#12151B] hover:text-[#92400E] hover:scale-110 transition-all p-1.5 rounded-sm hover:bg-black/5"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="stroke-[2.2]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#12151B] text-amber-300 border border-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#BCB19F] bg-[#DDD5C7] p-6 space-y-4 animate-fade-in shadow-xl">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs tracking-[0.18em] uppercase py-1.5 ${
                    link.highlight ? 'text-terracotta font-bold' : 'text-charcoal-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-sand-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-500 uppercase tracking-wider">{t('language', 'Language')}:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="bg-white border border-sand-200 px-2 py-1 text-xs text-charcoal-800 font-medium"
                >
                  {allLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-charcoal-500 uppercase tracking-wider">{t('currency', 'Currency')}:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-white border border-sand-200 px-2 py-1 text-xs text-charcoal-800 font-medium"
                >
                  {allCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol}) — {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
