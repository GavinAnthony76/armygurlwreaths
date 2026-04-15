import { motion } from 'framer-motion';
import { pageTransition } from '../../design-system/motion';

export default function Privacy() {
  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="heading-display text-4xl mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 2025</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Information We Collect</h2>
            <p>When you place an order or create an account, we collect your name, email address, shipping address, and phone number. Payment information is processed securely through Stripe or PayPal and is never stored on our servers.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmation and shipping notifications</li>
              <li>To respond to customer service inquiries</li>
              <li>To send promotional emails if you have opted in (you may unsubscribe at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted partners who assist us in operating our website and delivering your orders (e.g., shipping carriers), provided those parties agree to keep your information confidential.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Cookies</h2>
            <p>We use cookies to maintain your shopping cart and remember your preferences. You can disable cookies in your browser settings, though some features of the site may not function correctly as a result.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. All data transmitted between your browser and our server is encrypted using SSL/TLS.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at <a href="mailto:hello@armygurlwreaths.com" className="text-olive-600 underline">hello@armygurlwreaths.com</a>.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Contact</h2>
            <p>Questions about this policy? Email us at <a href="mailto:hello@armygurlwreaths.com" className="text-olive-600 underline">hello@armygurlwreaths.com</a>.</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
