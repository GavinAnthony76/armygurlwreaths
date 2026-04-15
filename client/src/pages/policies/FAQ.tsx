import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pageTransition, staggerContainer, fadeUp } from '../../design-system/motion';

const faqs = [
  {
    q: 'Are your wreaths handmade?',
    a: 'Yes — every single wreath is handcrafted by us, one at a time. We do not mass-produce. Each piece is made to order after you purchase.',
  },
  {
    q: 'How long does it take to receive my order?',
    a: 'Production takes 5–7 business days, plus shipping time (typically 3–5 business days for standard shipping). Total delivery time is usually 8–12 business days.',
  },
  {
    q: 'Can I request a custom wreath?',
    a: 'Absolutely! We love custom orders. Select "Custom Orders" from our Shop page or contact us at hello@armygurlwreaths.com with your ideas, colors, and any special requests.',
  },
  {
    q: 'What if my wreath arrives damaged?',
    a: 'Please contact us within 7 days of delivery with your order number and photos of the damage. We will send a replacement or issue a full refund.',
  },
  {
    q: 'Do you ship to military addresses (APO/FPO)?',
    a: 'Yes! We proudly ship to APO/FPO military addresses. As a military family ourselves, supporting our service members is our priority.',
  },
  {
    q: 'When is the last day to order for Christmas?',
    a: 'For guaranteed Christmas delivery, we recommend ordering by December 10th to allow for production and shipping time. We cannot guarantee delivery after that date during the holiday rush.',
  },
  {
    q: 'How do I care for my wreath?',
    a: 'See our detailed Care Instructions page for wreath-specific guidance. Generally, keep wreaths away from direct sunlight and moisture to preserve their colors and shape.',
  },
  {
    q: 'Do you offer wholesale or bulk pricing?',
    a: 'We occasionally accept bulk orders for events, military units, or organizations. Please reach out at hello@armygurlwreaths.com to discuss pricing and availability.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards through Stripe, as well as PayPal. All transactions are encrypted and secure.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be modified or cancelled within 24 hours of placement, before production begins. After that, we cannot accept cancellations as materials have already been allocated.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cream-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between w-full py-5 text-left gap-4"
      >
        <span className="font-heading font-semibold text-slate-900 text-sm sm:text-base leading-snug">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-slate-600 text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} className="section-label mb-2">Help</motion.p>
          <motion.h1 variants={fadeUp} className="heading-display text-4xl mb-4">Frequently Asked Questions</motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 mb-10">
            Can't find the answer you're looking for? <Link to="/contact" className="text-olive-600 underline">Contact us</Link> and we'll get back to you within 24 hours.
          </motion.p>
        </motion.div>

        <div className="card-base px-6">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
