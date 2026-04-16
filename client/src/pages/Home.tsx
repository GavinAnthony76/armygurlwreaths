import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Star, Shield, Truck, Heart, Award } from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';
import { fadeUp, staggerContainer } from '../design-system/motion';
import type { Product } from '@armygurl/shared';
import { pageTransition } from '../design-system/motion';
import { toast } from 'sonner';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products/featured').then((r) => r.data.data as Product[]),
  });

  const trustItems = [
    { icon: <Heart className="w-6 h-6" />, title: 'Made with Love', text: 'Every piece is handcrafted to order' },
    { icon: <Shield className="w-6 h-6" />, title: 'Military Proud', text: 'Supporting our service members always' },
    { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', text: 'On all orders over $75' },
    { icon: <Award className="w-6 h-6" />, title: 'Premium Quality', text: 'Durable, beautiful, lasting designs' },
  ];

  const testimonials = [
    { name: 'Sarah M.', location: 'Georgia', text: 'The patriotic wreath I ordered for my husband\'s homecoming was absolutely breathtaking. She captured everything I asked for perfectly.', rating: 5 },
    { name: 'Jennifer R.', location: 'Texas', text: 'My Army Strong hoodie is the softest thing I own. I get compliments every time I wear it. The quality is incredible.', rating: 5 },
    { name: 'Melissa T.', location: 'Virginia', text: 'Ordered a custom wreath and matching door sign for my son\'s graduation. She went above and beyond. We cried. 10/10.', rating: 5 },
  ];

  return (
    <motion.div {...pageTransition}>
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative h-screen min-h-[500px] sm:min-h-[600px] max-h-[900px] overflow-hidden flex items-center">
        {/* Parallax background */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://placehold.co/1920x1080/1e293b/fdfcf7?text=ArmyGurlWreaths')`,
            }}
          />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto max-w-7xl">
          <motion.div
            style={{ opacity: heroOpacity }}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gold-400" />
              <span className="text-gold-300 text-xs font-semibold tracking-[0.25em] uppercase">
                Handcrafted in the USA
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="heading-hero mb-6 text-balance"
            >
              Decor & Apparel That Tell{' '}
              <span className="italic text-gold-300">Your Story</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-cream-200/90 leading-relaxed mb-8 max-w-xl"
            >
              Wreaths, home decor, shirts, hoodies, and custom designs — each piece handcrafted with the love and dedication of a military family.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/shop" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-olive-500 hover:bg-olive-400 shadow-glow-olive">
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop/custom" className="inline-flex items-center justify-center gap-2 border border-white/40 hover:border-white/80 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-md transition-all duration-200 text-sm sm:text-base backdrop-blur-sm hover:bg-white/10">
                Custom Order
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {['SJ', 'MR', 'AT', 'PW'].map((initials) => (
                  <div key={initials} className="w-8 h-8 rounded-full bg-gradient-to-br from-olive-400 to-olive-700 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white/20">
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-cream-200/80 text-xs mt-0.5">500+ happy customers</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40" />
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ===== MARQUEE TRUST BAR ===== */}
      <div className="bg-olive-500 py-3 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {[...Array(4)].flatMap(() => [
            '✦ Free Shipping Over $75',
            '✦ Handcrafted to Order',
            '✦ Military Family Owned',
            '✦ 100% Satisfaction Guaranteed',
            '✦ Custom Orders Welcome',
          ]).map((text, i) => (
            <span key={i} className="text-cream-100 text-xs font-medium tracking-widest uppercase">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ===== FEATURED COLLECTIONS ===== */}
      <section className="section-wrapper bg-cream-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="section-label mb-3">Shop by Collection</motion.p>
            <motion.h2 variants={fadeUp} className="heading-display text-3xl sm:text-4xl lg:text-5xl mb-4">
              Find Your Perfect Piece
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 max-w-xl mx-auto">
              From handcrafted wreaths to patriotic apparel — each collection is designed with a distinct mood and purpose.
            </motion.p>
          </motion.div>

          {/* Collection cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: 'Wreaths', slug: 'wreaths', image: 'https://placehold.co/600x800/8b7f50/fdfcf7?text=Wreaths', desc: 'Handcrafted for every season' },
              { name: 'Apparel', slug: 'apparel', image: 'https://placehold.co/600x800/4b5320/fdfcf7?text=Apparel', desc: 'Shirts, hoodies & more' },
              { name: 'Home Decor', slug: 'home-decor', image: 'https://placehold.co/600x800/b8891e/fdfcf7?text=Home+Decor', desc: 'Signs, accents & more' },
              { name: 'Patriotic', slug: 'patriotic', image: 'https://placehold.co/600x800/c8373a/fdfcf7?text=Patriotic', desc: 'Military & American Pride' },
            ].map((col, i) => (
              <motion.div
                key={col.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop/${col.slug}`}
                  className="group relative block overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                    <p className="text-gold-300 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase mb-0.5 sm:mb-1 line-clamp-1">{col.desc}</p>
                    <h3 className="font-heading font-bold text-white text-base sm:text-xl">{col.name}</h3>
                    <p className="text-cream-200/70 text-xs mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Shop now <ArrowRight className="w-3 h-3" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      {featured && featured.length > 0 && (
        <section className="section-wrapper">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4"
            >
              <div>
                <motion.p variants={fadeUp} className="section-label mb-2">Handpicked for You</motion.p>
                <motion.h2 variants={fadeUp} className="heading-display text-3xl sm:text-4xl">Featured Products</motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link to="/shop" className="btn-outline text-sm">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            >
              {featured.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== BRAND STORY ===== */}
      <section className="section-wrapper bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-modal" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://placehold.co/800x1000/8b7f50/fdfcf7?text=Our+Story"
                  alt="Handcrafting products"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden sm:block absolute -bottom-6 -right-6 bg-olive-500 rounded-2xl p-5 shadow-modal max-w-48"
              >
                <p className="font-accent text-2xl text-white leading-tight">"Made with military heart"</p>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.p variants={fadeUp} className="text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                Our Story
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance">
                Born from Service,<br />Built with Pride
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-300 leading-relaxed mb-4">
                ArmyGurlWreaths started as a way to bring warmth and beauty to the doorsteps of military families — a reminder that home is always worth celebrating, no matter where you're stationed.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-300 leading-relaxed mb-8">
                From wreaths and home decor to shirts and hoodies for the whole family, every piece is made with attention to detail and pride. Because representing what you love should feel as good as it looks.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link to="/about" className="btn-outline border-white/30 text-white hover:bg-white hover:text-slate-900">
                  Read Our Story <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SIGNALS ===== */}
      <section className="py-14 bg-cream-100 border-y border-cream-200">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-olive-100 text-olive-600 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-wrapper">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="section-label mb-3">Customer Love</motion.p>
            <motion.h2 variants={fadeUp} className="heading-display text-3xl sm:text-4xl">
              Words from Our Community
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-6"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <blockquote className="text-slate-600 text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-olive-gradient flex items-center justify-center text-white text-xs font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER CTA ===== */}
      <section className="py-20 bg-olive-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-gold-400 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="text-gold-300 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Join the Family
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-white text-3xl sm:text-4xl mb-4">
              Be First to Know
            </motion.h2>
            <motion.p variants={fadeUp} className="text-cream-200/80 mb-8 max-w-md mx-auto">
              New collections, limited seasonal releases, and exclusive offers — delivered straight to your inbox.
            </motion.p>
            <motion.form
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newsletterEmail) return;
                setNewsletterEmail('');
                toast.success('You\'re on the list! We\'ll be in touch soon.');
              }}
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/60 transition-colors"
              />
              <button type="submit" className="bg-white text-olive-700 font-semibold px-6 py-3 rounded-lg hover:bg-cream-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </motion.form>
            <motion.p variants={fadeUp} className="text-white/50 text-xs mt-3">
              No spam. Unsubscribe anytime. We respect your privacy.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
