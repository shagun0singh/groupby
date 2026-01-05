"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getAuthToken } from "@/lib/api";
import { AuroraBackground } from "@/components/ui/aurora-background";
import FooterSection from "@/components/ui/footer";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  
  useEffect(() => {
    const token = getAuthToken();
    
    // If user is logged in, redirect to home page
    if (token) {
      router.push('/home');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show loading while checking auth status
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F7F7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Aurora Background Layer */}
      <AuroraBackground className="fixed inset-0 -z-10">
        <div></div>
      </AuroraBackground>

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6">
          <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
            GroupBy
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg">
                Sign up
              </button>
            </Link>
          </div>
        </header>

        <main className="relative w-full flex items-center justify-center pt-20 min-h-screen">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative z-10 max-w-5xl mx-auto px-12 text-center"
          >
            <h1 className="mb-6" style={{ fontSize: '72px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              <span className="text-slate-900 dark:text-white">Turn Your </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">Big Ideas </span>
              <span className="text-slate-900 dark:text-white">Into Real Events</span>
            </h1>
            
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              A comprehensive platform to help you discover local events and build meaningful connections. From finding workshops to hosting community gatherings, GroupBy makes event management simple and free.
            </p>
            
            <div className="flex items-center justify-center gap-12 mb-12 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">📄</span>
                <span>Host events for free.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">🔗</span>
                <span>Discover local gatherings.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">👥</span>
                <span>Connect with your community.</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6">
              <Link
                href="/login"
                className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-12 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg"
              >
                Sign up to get started →
              </Link>
              
              <Link
                href="/login"
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-150 border border-slate-300 dark:border-slate-700 shadow-lg"
              >
                Already have an account? Login
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
