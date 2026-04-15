import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { loginSchema, registerSchema } from '@armygurl/shared';
import { fadeUp, staggerContainer, pageTransition } from '../design-system/motion';
import { toast } from 'sonner';
import type { LoginInput, RegisterInput, User as UserType } from '@armygurl/shared';

export default function Account() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, user, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  if (isAuthenticated && user) {
    return <AccountProfile />;
  }

  return (
    <motion.div {...pageTransition} className="min-h-screen flex items-center justify-center bg-cream-50 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-olive-gradient flex items-center justify-center mx-auto mb-4 shadow-glow-olive">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Join the ArmyGurl family'}
          </p>
        </div>

        <div className="card-base p-8">
          {/* Toggle */}
          <div className="flex rounded-lg bg-cream-100 p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as typeof mode)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <LoginForm key="login" onSuccess={(u, t) => { setAuth(u, t); navigate(from, { replace: true }); }} />
            ) : (
              <RegisterForm key="register" onSuccess={(u, t) => { setAuth(u, t); navigate(from, { replace: true }); }} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (user: UserType, token: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const { data: res } = await api.post('/auth/login', data);
      onSuccess(res.data.user, res.data.accessToken);
      toast.success('Welcome back!');
    } catch {
      toast.error('Invalid email or password');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className="form-input pl-9"
          />
        </div>
        {errors.email && <p className="text-xs text-crimson-600 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="form-input pl-9"
          />
        </div>
        {errors.password && <p className="text-xs text-crimson-600 mt-1">{errors.password.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </button>
    </motion.form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: (user: UserType, token: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const { data: res } = await api.post('/auth/register', data);
      onSuccess(res.data.user, res.data.accessToken);
      toast.success('Account created! Welcome to ArmyGurlWreaths!');
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Registration failed');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
          <input {...register('firstName')} className="form-input" placeholder="Jane" />
          {errors.firstName && <p className="text-xs text-crimson-600 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
          <input {...register('lastName')} className="form-input" placeholder="Smith" />
          {errors.lastName && <p className="text-xs text-crimson-600 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
        <input {...register('email')} type="email" className="form-input" placeholder="you@example.com" />
        {errors.email && <p className="text-xs text-crimson-600 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
        <input {...register('password')} type="password" className="form-input" placeholder="At least 8 chars, 1 uppercase, 1 number" />
        {errors.password && <p className="text-xs text-crimson-600 mt-1">{errors.password.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </motion.form>
  );
}

function AccountProfile() {
  const { user } = useAuthStore();
  return (
    <motion.div {...pageTransition} className="min-h-screen py-16">
      <div className="container mx-auto max-w-2xl">
        <div className="card-base p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-olive-gradient flex items-center justify-center text-white font-bold text-xl">
              {user?.firstName?.[0] ?? user?.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-slate-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/orders" className="card-base p-4 hover:shadow-card-hover transition-shadow cursor-pointer group">
              <h3 className="font-semibold text-slate-800 group-hover:text-olive-700 transition-colors">Order History</h3>
              <p className="text-sm text-slate-500 mt-1">View and track your orders</p>
            </Link>
            <Link to="/contact" className="card-base p-4 hover:shadow-card-hover transition-shadow cursor-pointer group">
              <h3 className="font-semibold text-slate-800 group-hover:text-olive-700 transition-colors">Get Help</h3>
              <p className="text-sm text-slate-500 mt-1">Contact us with any questions</p>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
