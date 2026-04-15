import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';
import { toast } from 'sonner';
import api from '../lib/api';

const SUBJECTS = [
  'General Inquiry',
  'Custom Order Request',
  'Order Status',
  'Returns & Exchanges',
  'Wholesale / Bulk Order',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent! We'll respond within 24 hours.");
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    } catch {
      toast.error('Failed to send message. Please try emailing us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-5xl">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center mb-12">
          <motion.p variants={fadeUp} className="section-label mb-3">Get in Touch</motion.p>
          <motion.h1 variants={fadeUp} className="heading-display text-4xl mb-4">We'd Love to Hear from You</motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 max-w-lg mx-auto">
            Have questions about a product, need a custom order, or just want to say hello? We're here.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hello@armygurlwreaths.com', href: 'mailto:hello@armygurlwreaths.com' },
              { icon: <Phone className="w-5 h-5" />, label: 'Response Time', value: 'Within 24 hours' },
              { icon: <MapPin className="w-5 h-5" />, label: 'Ships From', value: 'United States' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-olive-600 text-sm hover:underline">{item.value}</a>
                  ) : (
                    <p className="text-slate-500 text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form column */}
          <form className="lg:col-span-3 card-base p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                <input
                  className="form-input"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <select
                className="form-input"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              >
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
              <textarea
                className="form-input resize-none"
                rows={5}
                placeholder="Tell us what you need..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
                minLength={10}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
