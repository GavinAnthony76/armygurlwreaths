import { motion } from 'framer-motion';
import { Sun, Droplets, Wind, Star, Shirt } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '../../design-system/motion';

const tips = [
  {
    icon: <Sun className="w-5 h-5" />,
    title: 'Avoid Direct Sunlight',
    text: 'Prolonged exposure to direct sunlight will fade colors on wreaths and decor. Hang in a shaded area or indoors away from south-facing windows.',
  },
  {
    icon: <Droplets className="w-5 h-5" />,
    title: 'Keep Decor Dry',
    text: 'Most wreaths and signs are not waterproof. If displayed outdoors, bring inside during rain or heavy dew.',
  },
  {
    icon: <Wind className="w-5 h-5" />,
    title: 'Light Dusting',
    text: 'Dust wreaths and decor gently with a soft hairdryer on the cool/low setting or a feather duster. Do not use water or cleaning sprays.',
  },
  {
    icon: <Shirt className="w-5 h-5" />,
    title: 'Apparel Care',
    text: 'Machine wash cold, inside out. Tumble dry low or hang dry. Do not iron directly on printed graphics.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Storage',
    text: 'Store off-season wreaths in the original box or a storage bag in a cool, dry place. Keep apparel folded or hung in a dry closet.',
  },
];

export default function Care() {
  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} className="section-label mb-2">Guides</motion.p>
          <motion.h1 variants={fadeUp} className="heading-display text-4xl mb-4">Product Care Instructions</motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 mb-10 text-lg">
            With a little care, your handcrafted items will stay beautiful for years to come.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {tips.map((tip) => (
            <div key={tip.title} className="card-base p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center flex-shrink-0">
                {tip.icon}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-900 text-sm">{tip.title}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Wreaths & Outdoor Decor</h2>
            <p>Wreaths and decor designed for outdoor use are made with UV-resistant and weather-tolerant materials where possible. However, extended outdoor exposure (more than one season) will naturally cause some fading and wear. We recommend bringing outdoor items inside during extreme weather.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Ribbon & Bow Care</h2>
            <p>Ribbons and bows on wreaths can flatten over time. To revive them, use a cool hairdryer to gently re-fluff. Wired ribbon bows can be reshaped by hand — simply re-bend the loops into your desired position.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Shirts, Hoodies & Apparel</h2>
            <p>All apparel should be washed cold, inside out, to protect printed designs. Tumble dry on low heat or hang dry for best results. Do not bleach or iron directly on graphic prints. Following these steps will keep your apparel looking fresh wash after wash.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3">Signs & Home Decor</h2>
            <p>Wooden signs and home accents should be kept in dry environments. Wipe with a soft, dry cloth to remove dust. Avoid placing in areas with high humidity, direct heat, or moisture to preserve the finish and painted details.</p>
          </section>

          <section className="card-base p-5 border-l-4 border-olive-500">
            <p className="text-slate-700 text-sm">Have a question about caring for a specific product? Email us at <a href="mailto:hello@armygurlwreaths.com" className="text-olive-600 underline">hello@armygurlwreaths.com</a> and we'll give you tailored care advice for your piece.</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
