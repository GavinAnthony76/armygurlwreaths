import { motion } from 'framer-motion';
import { pageTransition } from '../../design-system/motion';

export default function Terms() {
  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="heading-display text-4xl mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 2025</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Agreement to Terms</h2>
            <p>By accessing or using ArmyGurlWreaths, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Products & Orders</h2>
            <p>All wreaths are handcrafted to order. Because each piece is made individually, slight variations in color and arrangement from product photos are expected and are part of the handmade nature of our products. We reserve the right to refuse or cancel orders at our discretion.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Pricing & Payment</h2>
            <p>Prices are listed in US dollars. We reserve the right to change prices at any time without notice. Payment is required in full at the time of purchase. We accept major credit cards through Stripe and PayPal.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Custom Orders</h2>
            <p>Custom orders require approval before production begins. Once a custom order enters production, cancellations are not accepted. Please ensure all customization details are correct before submitting.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Intellectual Property</h2>
            <p>All content on this website, including photos, designs, and text, is the property of ArmyGurlWreaths and may not be reproduced without express written permission.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Limitation of Liability</h2>
            <p>ArmyGurlWreaths is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the purchase price of the product in question.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Contact</h2>
            <p>Questions? Reach us at <a href="mailto:hello@armygurlwreaths.com" className="text-olive-600 underline">hello@armygurlwreaths.com</a>.</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
