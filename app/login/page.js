// app/login/page.js
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, Key, User, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props) => (
    <svg viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.502,44,30.852,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState('login'); // 'login' or 'signup'
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: formData.email, 
        name: formData.name,
        isSignUp: view === 'signup' 
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setShowOtp(true);
    } else {
      setError(data.message || 'An error occurred.');
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      otp: formData.otp,
      name: formData.name,
      isSignUp: view === 'signup'
    });
    if (result.ok) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Invalid OTP.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-brand-green" />
                <span className="text-2xl font-serif font-bold text-brand-green-darkest">PurnAyu</span>
            </Link>
            <h1 className="text-3xl font-bold text-brand-green-darkest">
              {view === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-brand-text-light mt-2">
              {view === 'login' ? 'Sign in to access your dashboard' : 'Start your wellness journey with us'}
            </p>
          </div>
          
          <form onSubmit={showOtp ? handleVerify : handleOtpRequest}>
            {view === 'signup' && (
              <div className="relative mb-4">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Enter your name" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg" required disabled={showOtp} />
              </div>
            )}
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="Enter your email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg" required disabled={showOtp} />
            </div>
            {showOtp && (
              <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="relative mb-4">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Enter OTP" name="otp" value={formData.otp} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg" required />
              </motion.div>
            )}
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <motion.button type="submit" whileHover={{ scale: 1.02 }} className="w-full py-3 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-dark" disabled={loading}>
              {loading ? 'Please wait...' : (showOtp ? (view === 'login' ? 'Verify & Login' : 'Verify & Sign Up') : (view === 'login' ? 'Login with OTP' : 'Send OTP'))}
            </motion.button>
          </form>

          <div className="text-center mt-4">
            <button onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setShowOtp(false); setError(''); }} className="text-sm font-semibold text-brand-green hover:underline">
              {view === 'login' ? 'Create a new account' : 'Already have an account? Login'}
            </button>
          </div>

          <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <motion.button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} whileHover={{ scale: 1.02 }} className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg bg-white font-semibold hover:bg-gray-50">
            <GoogleIcon className="h-6 w-6 mr-3" />
            Continue with Google
          </motion.button>
        </motion.div>
      </div>
      <div className="hidden lg:block lg:w-3/4 bg-cover bg-center" style={{ backgroundImage: "url('/2.jpg')" }}></div>
    </div>
  );
}