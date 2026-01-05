"use client";

import { useState } from "react";
import { User, Mail, Lock, ArrowRight, Phone, MapPin } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

interface GlassmorphismAuthProps {
  isSignIn?: boolean;
  onToggle?: () => void;
}

/**
 * A glassmorphism-style authentication form component with animated labels and Google login.
 */
export function GlassmorphismAuth({ isSignIn: initialIsSignIn = true, onToggle }: GlassmorphismAuthProps) {
  const [isSignIn, setIsSignIn] = useState(initialIsSignIn);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    if (onToggle) onToggle();
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        console.log('🔄 Sending Google token to backend:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: tokenResponse.access_token,
          }),
        });

        console.log('📡 Backend response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('auth_token', data.token);
          console.log('✅ Google login successful:', data);
          
          // Check if user needs to complete profile
          if (data.isNewUser || !data.user?.phone || !data.user?.location?.city) {
            console.log('🔄 New user, redirecting to complete profile');
            window.location.href = '/complete-profile';
          } else {
            console.log('🔄 Existing user, redirecting to home');
            window.location.href = '/home';
          }
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error('❌ Backend authentication failed:', response.status, errorData);
          alert(`Backend error (${response.status}): ${errorData.message || 'Authentication failed'}`);
        }
      } catch (error: any) {
        console.error('❌ Google login error:', error);
        alert(`Error: ${error.message}\n\nCheck console (F12) for details`);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('❌ Google OAuth error:', error);
      alert(`Google OAuth failed: ${JSON.stringify(error)}\n\nCheck console (F12) for details`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignIn ? 'Sign In submitted' : 'Sign Up submitted');
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          {isSignIn ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {isSignIn ? 'Sign in to continue' : 'Join us today'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isSignIn && (
          <>
            {/* Full Name - Sign Up Only */}
            <div className="relative z-0">
              <input
                type="text"
                id="floating_name"
                className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " 
                required
              />
              <label
                htmlFor="floating_name"
                className="absolute text-sm text-slate-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <User className="inline-block mr-2 -mt-1" size={16} />
                Full Name
              </label>
            </div>

            {/* Phone Number - Sign Up Only */}
            <div className="relative z-0">
              <input
                type="tel"
                id="floating_phone"
                className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " 
                required
              />
              <label
                htmlFor="floating_phone"
                className="absolute text-sm text-slate-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <Phone className="inline-block mr-2 -mt-1" size={16} />
                Phone Number
              </label>
            </div>

            {/* City - Sign Up Only */}
            <div className="relative z-0">
              <input
                type="text"
                id="floating_city"
                className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " 
                required
              />
              <label
                htmlFor="floating_city"
                className="absolute text-sm text-slate-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <MapPin className="inline-block mr-2 -mt-1" size={16} />
                City
              </label>
            </div>
          </>
        )}

        {/* Email Input with Animated Label */}
        <div className="relative z-0">
          <input
            type="email"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" " 
            required
          />
          <label
            htmlFor="floating_email"
            className="absolute text-sm text-slate-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <Mail className="inline-block mr-2 -mt-1" size={16} />
            Email Address
          </label>
        </div>

        {/* Password Input with Animated Label */}
        <div className="relative z-0">
          <input
            type="password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_password"
            className="absolute text-sm text-slate-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            <Lock className="inline-block mr-2 -mt-1" size={16} />
            Password
          </label>
        </div>

        {isSignIn && (
          <div className="flex items-center justify-end">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-900 transition">Forgot Password?</a>
          </div>
        )}
        
        <button
          type="submit"
          className="group w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-blue-500 transition-all duration-300"
        >
          {isSignIn ? 'Sign In' : 'Sign Up'}
          <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-white/90 hover:bg-white rounded-lg text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5S45.5 36.017 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.839-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.642 6.723 6.306 14.691z"></path>
            <path fill="#4CAF50" d="M24 45.5c5.613 0 10.553-2.306 14.802-6.341l-5.839-5.841C30.842 35.846 27.059 38 24 38c-5.039 0-9.345-2.608-11.124-6.481l-6.571 4.819C9.642 41.277 16.318 45.5 24 45.5z"></path>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.839 5.841C44.196 35.123 45.5 29.837 45.5 24c0-1.538-.135-3.022-.389-4.417z"></path>
          </svg>
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-600">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
        <button 
          onClick={handleToggle}
          className="font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          {isSignIn ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
}

