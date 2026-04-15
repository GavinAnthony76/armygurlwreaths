import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import api from '../../lib/api';
import { toast } from 'sonner';
import { cn } from '../../lib/cn';

const navLinks = [
  { label: 'Shop All', href: '/shop' },
  {
    label: 'Collections',
    href: '/shop',
    children: [
      { label: 'Seasonal', href: '/shop/seasonal' },
      { label: 'Patriotic', href: '/shop/patriotic' },
      { label: 'Everyday', href: '/shop/everyday' },
      { label: 'Custom Orders', href: '/shop/custom' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { toggleCart, items } = useCartStore();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      navigate('/');
      toast.success('Logged out successfully');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-cream-200'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto max-w-7xl">
        <nav className="flex items-center justify-between h-16 lg:h-18">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-full bg-olive-gradient flex items-center justify-center shadow-glow-olive group-hover:shadow-glow-gold transition-shadow duration-300">
              <span className="text-white text-xs font-bold font-heading">AGW</span>
            </div>
            <div>
              <div className="font-heading font-bold text-slate-900 text-base leading-none">
                ArmyGurl
              </div>
              <div className="font-accent text-olive-500 text-xs leading-none">Wreaths</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className="nav-link flex items-center gap-1 px-3 py-2"
                    onMouseEnter={() => setCollectionsOpen(true)}
                    onMouseLeave={() => setCollectionsOpen(false)}
                    onClick={() => { navigate(link.href); setCollectionsOpen(false); }}
                  >
                    {link.label}
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', collectionsOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {collectionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-modal border border-cream-200 py-2 z-50"
                        onMouseEnter={() => setCollectionsOpen(true)}
                        onMouseLeave={() => setCollectionsOpen(false)}
                      >
                        {link.children.map((child) => (
                          <NavLink
                            key={child.label}
                            to={child.href}
                            className={({ isActive }) => cn(
                              'block px-4 py-2 text-sm text-slate-700 hover:bg-cream-100 hover:text-olive-600 transition-colors',
                              isActive && 'text-olive-600 font-medium'
                            )}
                            onClick={() => setCollectionsOpen(false)}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={({ isActive }) => cn('nav-link px-3 py-2', isActive && 'text-olive-600')}
                >
                  {link.label}
                </NavLink>
              )
            )}
          </div>

          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="btn-ghost p-2 rounded-full"
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-label="Account menu"
                >
                  <User className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-modal border border-cream-200 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-cream-200">
                          <div className="text-xs text-slate-500">Signed in as</div>
                          <div className="text-sm font-medium text-slate-800 truncate">{user?.email}</div>
                        </div>
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-olive-600 font-medium hover:bg-cream-100">
                            Admin Dashboard
                          </Link>
                        )}
                        <Link to="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-cream-100">My Account</Link>
                        <Link to="/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-cream-100">Order History</Link>
                        <button onClick={() => { setAccountOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-sm text-crimson-600 hover:bg-crimson-50">
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/account" className="btn-ghost p-2 rounded-full flex">
                <User className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={toggleCart}
              className="btn-ghost p-2 rounded-full relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-crimson-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </button>

            <button
              className="btn-ghost p-2 rounded-full lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-cream-200 overflow-hidden"
          >
            <div className="container py-4 space-y-1">
              <NavLink to="/shop" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-olive-600">
                Shop All
              </NavLink>
              <div className="pl-4 space-y-1 border-l-2 border-cream-300">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-1">Collections</div>
                {navLinks[1].children?.map((child) => (
                  <NavLink key={child.label} to={child.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-600 hover:text-olive-600">
                    {child.label}
                  </NavLink>
                ))}
              </div>
              <NavLink to="/about" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-olive-600">
                About
              </NavLink>
              <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-olive-600">
                Contact
              </NavLink>
              <div className="pt-2 border-t border-cream-200">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-1 py-1.5">
                      <div className="text-xs text-slate-500">Signed in as</div>
                      <div className="text-sm font-medium text-slate-800 truncate">{user?.email}</div>
                    </div>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-olive-600 hover:text-olive-700">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-700 hover:text-olive-600">
                      My Account
                    </Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-700 hover:text-olive-600">
                      Order History
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="block w-full text-left py-2 text-sm text-crimson-600 hover:text-crimson-700"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="btn-outline w-full text-center">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
