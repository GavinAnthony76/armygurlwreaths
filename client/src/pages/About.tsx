import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Award, Leaf, Sparkles, Shield, Users } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '../design-system/motion';

const VALUES = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Made with Love',
    description: 'Every wreath is hand-assembled — no assembly lines, no shortcuts. Each one is crafted with intention and care.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Military at Heart',
    description: 'We are part of the military family. We understand deployments, homecomings, and the pride of service — that spirit is woven into every piece.',
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'Quality Materials',
    description: 'We source premium ribbons, florals, and accents that hold their beauty season after season, indoors or out.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Custom & Personal',
    description: 'Your front door is unique. We love making custom orders — bring us your colors, themes, or ideas and we\'ll bring them to life.',
  },
];

const STEPS = [
  { step: '01', title: 'Select or Design', description: 'Browse our ready-made collection or reach out to start a fully custom creation tailored to you.' },
  { step: '02', title: 'Handcrafted to Order', description: 'Your wreath is assembled by hand with premium materials. We take 5–7 business days to get it just right.' },
  { step: '03', title: 'Carefully Packaged', description: 'Each piece is wrapped and boxed to survive shipping and arrive at your door looking perfect.' },
  { step: '04', title: 'Delivered with Pride', description: 'Your wreath arrives ready to hang. We include care instructions so it stays beautiful for years.' },
];

export default function About() {
  return (
    <motion.div {...pageTransition}>
      {/* Hero */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-olive-500 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-gold-500 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative">
          <p className="section-label text-olive-400 mb-4">Our Story</p>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
            Born from Love of Home & Service
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            ArmyGurlWreaths is more than a shop — it's a mission to bring beauty, pride, and warmth to every doorstep. Rooted in the military community, built by hand, shipped with heart.
          </p>
        </div>
      </div>

      {/* Story section */}
      <section className="section-wrapper">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&q=80"
                alt="Handcrafting a wreath"
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
              <motion.p variants={fadeUp} className="section-label mb-3">The Beginning</motion.p>
              <motion.h2 variants={fadeUp} className="heading-display text-3xl mb-6">
                Every Wreath Tells a Story
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-4">
                What started as a way to decorate for homecomings became a full passion. We know the feeling of counting down the days until your soldier walks through the door — and we want that door to be worthy of the moment.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-4">
                Every wreath is hand-assembled with premium materials, seasonal accents, and deep attention to detail. We don't use machines. We don't rush. We create.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-8">
                Whether you're welcoming home a hero, celebrating the seasons, or simply wanting your home to feel warm and inviting — we make something that speaks for you before you even open the door.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="btn-primary">Shop Collection</Link>
                <Link to="/contact" className="btn-outline">Request Custom Order</Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Users className="w-8 h-8" />, stat: '500+', label: 'Happy Customers' },
              { icon: <Award className="w-8 h-8" />, stat: '100%', label: 'Handcrafted' },
              { icon: <Heart className="w-8 h-8" />, stat: 'Military', label: 'Family Owned' },
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

      {/* Values */}
      <section className="section-wrapper">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="section-label mb-3">What We Stand For</motion.p>
            <motion.h2 variants={fadeUp} className="heading-display text-3xl">Our Values</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-base p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-olive-100 text-olive-600 flex items-center justify-center flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="section-label text-olive-400 mb-3">The Process</motion.p>
            <motion.h2 variants={fadeUp} className="heading-display text-white text-3xl">From Idea to Doorstep</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-olive-500/20 border border-olive-500/40 text-olive-400 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-heading font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-wrapper">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.p variants={fadeUp} className="section-label mb-3">Ready?</motion.p>
            <motion.h2 variants={fadeUp} className="heading-display text-3xl sm:text-4xl mb-4">
              Find Your Perfect Wreath
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 mb-8 max-w-lg mx-auto">
              Browse our full collection or tell us exactly what you're envisioning. We'd love to create something special for your home.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/shop" className="btn-primary px-8 py-3">Browse All Wreaths</Link>
              <Link to="/contact" className="btn-outline px-8 py-3">Contact Us</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
