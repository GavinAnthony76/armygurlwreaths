import { motion } from 'framer-motion';
import { Truck, Package, Clock, MapPin } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '../../design-system/motion';

const highlights = [
  { icon: <Clock className="w-5 h-5" />, title: 'Production Time', text: '5–7 business days per wreath, as each is handcrafted to order.' },
  { icon: <Truck className="w-5 h-5" />, title: 'Free Shipping', text: 'All orders over $75 ship free within the contiguous United States.' },
  { icon: <Package className="w-5 h-5" />, title: 'Careful Packaging', text: 'Every wreath is packaged with protective foam and a reinforced box to arrive in perfect condition.' },
  { icon: <MapPin className="w-5 h-5" />, title: 'Ships From', text: 'United States. We currently ship to all 50 states including APO/FPO military addresses.' },
];

export default function Shipping() {
  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} className="section-label mb-2">Policies</motion.p>
          <motion.h1 variants={fadeUp} className="heading-display text-4xl mb-10">Shipping Policy</motion.h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {highlights.map((h) => (
            <div key={h.title} className="card-base p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center flex-shrink-0">
                {h.icon}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-900 text-sm">{h.title}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{h.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Shipping Rates</h2>
            <div className="overflow-hidden rounded-xl border border-cream-200">
              <table className="w-full text-sm">
                <thead className="bg-cream-100 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-3">Order Total</th>
                    <th className="text-left px-4 py-3">Shipping Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-cream-200">
                    <td className="px-4 py-3">Under $75</td>
                    <td className="px-4 py-3">$8.95 flat rate</td>
                  </tr>
                  <tr className="border-t border-cream-200 bg-olive-50">
                    <td className="px-4 py-3 font-medium text-olive-700">$75 and over</td>
                    <td className="px-4 py-3 font-medium text-olive-700">FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Order Tracking</h2>
            <p>Once your order ships, you will receive a shipping confirmation email with a tracking number. Please allow 24–48 hours for tracking information to update after you receive the notification.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Delivery Issues</h2>
            <p>If your order arrives damaged or is lost in transit, please contact us within 7 days of the expected delivery date at <a href="mailto:hello@armygurlwreaths.com" className="text-olive-600 underline">hello@armygurlwreaths.com</a> with your order number and photos of any damage. We will work to make it right.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Holiday Ordering</h2>
            <p>During peak holiday seasons (October–December and around major holidays), production times may be extended by 2–5 additional business days. We recommend ordering early to ensure delivery before important dates.</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
