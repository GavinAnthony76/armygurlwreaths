import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../design-system/motion';

export default function NotFound() {
  return (
    <motion.div {...pageTransition} className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="font-heading text-8xl font-black text-cream-300 mb-4">404</div>
        <h1 className="font-heading font-bold text-2xl text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </motion.div>
  );
}
