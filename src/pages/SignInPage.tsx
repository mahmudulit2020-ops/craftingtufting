import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (forgotMode) {
      setLoading(true);
      const { error: resetError } = await resetPassword(email);
      setLoading(false);
      if (resetError) {
        setError(resetError);
      } else {
        setForgotSent(true);
      }
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6114346/pexels-photo-6114346.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1000"
          alt="Handcrafted rugs"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900/70 via-charcoal-900/50 to-accent-dark/60" />
        <div className="absolute inset-0 jamdani-bg" />
        <div className="relative flex flex-col justify-end p-12 text-cream">
          <div className="kantha-divider mb-6 w-24" />
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Welcome Back
          </h1>
          <p className="text-cream/70 text-base leading-relaxed max-w-md">
            Sign in to manage your orders, track custom rug production, and
            revisit your saved designs.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-charcoal-500 hover:text-accent transition-colors mb-10">
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="mb-8">
            <div className="kantha-divider w-16 mb-4" />
            <h2 className="text-2xl font-bold text-charcoal-900 mb-2">
              {forgotMode ? 'Reset Password' : 'Sign In'}
            </h2>
            <p className="text-sm text-charcoal-500">
              {forgotMode
                ? "Enter your email and we'll send you a reset link."
                : 'Welcome back. Please enter your details.'}
            </p>
          </div>

          {forgotSent ? (
            <div className="bg-sand-50 border border-sand-200 p-6 text-center">
              <p className="text-sm text-charcoal-700 mb-4">
                If an account exists for that email, a password reset link has been sent.
              </p>
              <button onClick={() => { setForgotMode(false); setForgotSent(false); }} className="text-sm text-accent hover:underline">
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
              {!forgotMode && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-xs text-accent hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input-field pl-11 pr-11"
                      autoComplete="current-password"
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
              )}

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
                {loading ? 'Please wait...' : forgotMode ? 'Send Reset Link' : 'Sign In'}
                {!loading && <ArrowRight size={16} />}
              </button>

              {/* Switch */}
              {!forgotMode && (
                <p className="text-center text-sm text-charcoal-500">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-accent font-medium hover:underline">
                    Create one
                  </Link>
                </p>
              )}

              {forgotMode && (
                <p className="text-center text-sm text-charcoal-500">
                  Remember your password?{' '}
                  <button type="button" onClick={() => setForgotMode(false)} className="text-accent font-medium hover:underline">
                    Back to Sign In
                  </button>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
