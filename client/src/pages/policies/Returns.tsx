import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, fadeUp } from '../../design-system/motion';

export default function Returns() {
  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} className="section-label mb-2">Policies</motion.p>
          <motion.h1 variants={fadeUp} className="heading-display text-4xl mb-4">Returns & Exchanges</motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 mb-10 text-lg">
            Your satisfaction is our priority. If something isn't right, we'll make it right.
          </motion.p>
        </motion.div>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section className="card-base p-6 border-l-4 border-olive-500">
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-2">Our Guarantee</h2>
            <p>Because many of our products are handcrafted to order, we take great care to ensure yours arrives beautiful and intact. If your order arrives damaged, defective, or significantly different from what was described, we will offer a replacement or full refund — no questions asked.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">What We Accept</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>Items that arrived damaged during shipping (photos required)</li>
              <li>Items that are defective or have significant quality issues</li>
              <li>Items that are materially different from the product description</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">What We Cannot Accept</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>Change-of-mind returns on handcrafted items (made-to-order items cannot be resold)</li>
              <li>Custom orders where all specifications were provided correctly</li>
              <li>Items returned without prior authorization</li>
              <li>Items returned more than 14 days after delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">How to Request a Return</h2>
            <ol className="list-decimal pl-5 space-y-3 text-slate-700">
              <li>Email us at <a href="mailto:hello@armygurlwreaths.com" className="text-olive-600 underline">hello@armygurlwreaths.com</a> within 7 days of delivery.</li>
              <li>Include your order number and a description of the issue.</li>
              <li>Attach photos of the damage or defect.</li>
              <li>We will respond within 24 hours with next steps.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Refund Timeline</h2>
            <p>Once a return is approved, refunds are processed within 5–7 business days back to your original payment method. You will receive an email confirmation when the refund is issued.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Exchanges</h2>
            <p>We do not offer direct exchanges. If you would like a different product, please request a refund (if eligible) and place a new order.</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
