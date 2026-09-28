import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): string | null => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters long.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (!agreeTerms) return 'Please agree to the Terms and Privacy Policy.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName);
    setLoading(false);

    if (signUpError) {
      setError(signUpError);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center animate-scale-in">
            <Check size={32} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-3">Account Created Successfully</h2>
          <p className="text-sm text-charcoal-500 mb-8">
            Welcome to Crafting & Tufting. Your account has been created and you're now signed in.
          </p>
          <button onClick={() => navigate('/account')} className="btn-primary">
            Go to My Account <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1000"
          alt="Handcrafted rugs"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900/70 via-charcoal-900/50 to-accent-dark/60" />
        <div className="absolute inset-0 jamdani-bg" />
        <div className="relative flex flex-col justify-end p-12 text-cream">
          <div className="kantha-divider mb-6 w-24" />
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Join Our Craft
          </h1>
          <p className="text-cream/70 text-base leading-relaxed max-w-md">
            Create an account to design custom rugs, track orders, save your
            favorite designs, and enjoy a seamless crafting experience.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-charcoal-500 hover:text-accent transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="mb-8">
            <div className="kantha-divider w-16 mb-4" />
            <h2 className="text-2xl font-bold text-charcoal-900 mb-2">Create Account</h2>
            <p className="text-sm text-charcoal-500">Join Crafting & Tufting today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="input-field pl-11"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field pl-11 pr-11"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="input-field pl-11"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-accent cursor-pointer"
              />
              <span className="text-xs text-charcoal-500 leading-relaxed">
                I agree to the Terms of Service and Privacy Policy. I understand
                that custom rug orders require a 50% advance payment.
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>

            {/* Switch */}
            <p className="text-center text-sm text-charcoal-500">
              Already have an account?{' '}
              <Link to="/signin" className="text-accent font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
