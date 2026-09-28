import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-cream">
      <section className="bg-sand-50 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 text-center">
          <p className="section-label mb-4">Get in Touch</p>
          <h1 className="font-display text-display-lg text-charcoal-900 mb-4">Contact Us</h1>
          <p className="text-charcoal-500 max-w-xl mx-auto">
            Questions about a custom rug, an order, or our collections? We're here to help.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          {/* Info */}
          <Reveal>
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl text-charcoal-900 mb-6">Reach Us</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <MapPin size={20} className="text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-800">Studio</p>
                      <p className="text-sm text-charcoal-500">Dhaka, Bangladesh</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone size={20} className="text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-800">Phone</p>
                      <p className="text-sm text-charcoal-500">+880 1700 000000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail size={20} className="text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-800">Email</p>
                      <p className="text-sm text-charcoal-500">hello@craftingtufting.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-sand-50 p-6">
                <h3 className="font-display text-lg text-charcoal-900 mb-2">Studio Hours</h3>
                <p className="text-sm text-charcoal-500">Saturday – Thursday</p>
                <p className="text-sm text-charcoal-500">10:00 AM – 7:00 PM</p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={150}>
            {sent ? (
              <div className="bg-white border border-sand-100 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Send size={28} className="text-accent" />
                </div>
                <h2 className="font-display text-2xl text-charcoal-900 mb-3">Message Sent</h2>
                <p className="text-charcoal-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-secondary">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-sand-100 p-6 lg:p-10 space-y-5">
                <h2 className="font-display text-2xl text-charcoal-900 mb-2">Send a Message</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Name *</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Message *</label>
                  <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
