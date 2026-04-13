import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';
import { toast } from 'sonner';

export default function Contact() {
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
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hello@armygurlwreaths.com' },
              { icon: <Phone className="w-5 h-5" />, label: 'Response Time', value: 'Within 24 hours' },
              { icon: <MapPin className="w-5 h-5" />, label: 'Ships From', value: 'United States' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="text-slate-500 text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <form
              className="card-base p-6 space-y-4"
              onSubmit={(e) => { e.preventDefault(); toast.success('Message sent! We\'ll respond within 24 hours.'); }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                  <input className="form-input" placeholder="Jane Smith" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" className="form-input" placeholder="you@email.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                <select className="form-input">
                  <option>General Inquiry</option>
                  <option>Custom Order Request</option>
                  <option>Order Status</option>
                  <option>Returns & Exchanges</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea className="form-input resize-none" rows={5} placeholder="Tell us what you need..." required />
              </div>
              <button type="submit" className="btn-primary w-full py-3">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
