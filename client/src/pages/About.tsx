import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Star, Award } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';

export default function About() {
  return (
    <motion.div {...pageTransition}>
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-olive-500 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative">
          <p className="section-label text-olive-400 mb-4">Our Story</p>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-6">
            Born from Love of Home & Service
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            ArmyGurlWreaths is more than a business — it's a mission to bring beauty, pride, and warmth to every doorstep.
          </p>
        </div>
      </div>

      <section className="section-wrapper">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&q=80"
                alt="Handcrafting"
                className="rounded-2xl shadow-modal w-full object-cover"
                style={{ aspectRatio: '4/5' }}
              />
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 variants={fadeUp} className="heading-display text-3xl mb-6">
                Every Wreath Tells a Story
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-4">
                What started as a way to decorate for homecomings became a full passion. We know the feeling of counting down the days until your soldier walks through the door — and we want that door to be worthy of the moment.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-8">
                Every wreath is hand-assembled with premium materials, seasonal accents, and deep attention to detail. We don't use machines. We don't rush. We create.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="btn-primary">Shop Collection</Link>
                <Link to="/shop/custom" className="btn-outline">Custom Order</Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream-100">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Heart className="w-8 h-8" />, stat: '500+', label: 'Happy Customers' },
              { icon: <Star className="w-8 h-8" />, stat: '4.9★', label: 'Average Rating' },
              { icon: <Award className="w-8 h-8" />, stat: '100%', label: 'Handcrafted' },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-olive-100 text-olive-600 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="font-heading font-bold text-3xl text-slate-900">{item.stat}</div>
                <div className="text-slate-500 text-sm">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
