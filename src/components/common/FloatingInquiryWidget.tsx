import React, { useState } from 'react';
import { MessageSquare, X, Send, PhoneCall, Check, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingInquiryWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 2800);
  };

  return (
    <>
      {/* Floating Trigger Button (matching the video's bottom-right button) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2 bg-[#111317] hover:bg-[#1a1c22] border border-teal-500/40 text-white rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 group"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
          </span>
          <MessageSquare size={14} className="text-teal-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-medium tracking-wide">
            Inquire briefly...
          </span>
        </button>
      </div>

      {/* Inquiry Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#111317] border border-white/15 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-white animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="bg-[#191d24] px-4 py-3.5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Atelier Concierge Inquiry
                  </h3>
                  <p className="text-[10px] text-teal-400 font-mono">
                    Online Now · Tejgaon Artisan Quarter
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sand-400 hover:text-white p-1 rounded-xs"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5">
              {submitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                    <Check size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-white">Inquiry Received</h4>
                  <p className="text-xs text-sand-300/80">
                    Our master weaver concierge will contact you within 2 hours with initial dimensions and wool yarn estimations.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-sand-300 mb-1">
                      Your Name / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sofia Rahaman"
                      className="w-full bg-[#1b1f24] border border-white/15 focus:border-teal-400 px-3 py-2 rounded-xs outline-hidden text-white placeholder:text-sand-400/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-sand-300 mb-1">
                      WhatsApp or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 17... or email@domain.com"
                      className="w-full bg-[#1b1f24] border border-white/15 focus:border-teal-400 px-3 py-2 rounded-xs outline-hidden text-white placeholder:text-sand-400/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-sand-300 mb-1">
                      Custom Rug Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g., Looking for a 5x7 ft geometric tufted rug in terracotta and natural jute..."
                      className="w-full bg-[#1b1f24] border border-white/15 focus:border-teal-400 px-3 py-2 rounded-xs outline-hidden text-white placeholder:text-sand-400/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold py-2.5 px-4 rounded-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-500/20"
                  >
                    <span>Send Inquiry</span>
                    <Send size={13} />
                  </button>
                </form>
              )}

              {/* Fast alternative actions */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <a
                  href="https://wa.me/8801700889900"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-medium"
                >
                  <PhoneCall size={12} />
                  <span>WhatsApp Concierge</span>
                </a>

                <Link
                  to="/track-order"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 text-sand-300 hover:text-white"
                >
                  <Compass size={12} />
                  <span>Track Order</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
