import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Footer() {
  const [footerEmail, setFooterEmail] = useState('');

  return (
    <footer className="bg-slate-900 text-cream-200 pt-10 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 pb-8 sm:pb-10 border-b border-slate-700">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-olive-gradient flex items-center justify-center">
                <span className="text-white text-xs font-bold font-heading">AGW</span>
              </div>
              <div>
                <div className="font-heading font-bold text-white text-base leading-none">ArmyGurl</div>
                <div className="font-accent text-olive-400 text-xs leading-none">Decor & Apparel</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Handcrafted wreaths, home decor, and apparel made with love, pride, and purpose. Every piece tells a story.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/armygurlwreaths" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-olive-600 flex items-center justify-center transition-colors duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/armygurlwreaths" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-olive-600 flex items-center justify-center transition-colors duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:hello@armygurlwreaths.com" aria-label="Email" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-olive-600 flex items-center justify-center transition-colors duration-200">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'Wreaths', href: '/shop/wreaths' },
                { label: 'Apparel', href: '/shop/apparel' },
                { label: 'Home Decor', href: '/shop/home-decor' },
                { label: 'Patriotic', href: '/shop/patriotic' },
                { label: 'Custom Orders', href: '/shop/custom' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate-400 hover:text-olive-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Returns & Exchanges', href: '/returns' },
                { label: 'Care Instructions', href: '/care' },
                { label: 'FAQ', href: '/faq' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate-400 hover:text-olive-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">Stay Connected</h4>
            <p className="text-sm text-slate-400 mb-4">
              Get seasonal updates, exclusive offers, and new collection announcements.
            </p>
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!footerEmail) return;
                setFooterEmail('');
                toast.success('You\'re on the list! We\'ll be in touch soon.');
              }}
            >
              <input
                type="email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-olive-500 transition-colors"
              />
              <button type="submit" className="w-full bg-olive-500 hover:bg-olive-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ArmyGurlWreaths. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-crimson-500 fill-crimson-500" /> for those who serve
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-300">Privacy</Link>
            <Link to="/terms" className="text-xs text-slate-500 hover:text-slate-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
