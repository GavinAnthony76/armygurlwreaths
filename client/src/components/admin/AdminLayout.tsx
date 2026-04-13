import { Outlet, Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/cn';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/admin/products', label: 'Products', icon: <Package className="w-4 h-4" /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-800">
          <div className="font-heading font-bold text-white">AGW Admin</div>
          <div className="text-xs text-slate-500 mt-0.5">Control Panel</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/admin'}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-olive-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-slate-950 p-8">
        <Outlet />
      </main>
    </div>
  );
}
