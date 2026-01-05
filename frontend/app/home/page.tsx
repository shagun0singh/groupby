"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthToken } from "@/lib/api";
import { ProfileButton } from "@/components/ui/profile-button";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { AuroraBackground } from "@/components/ui/aurora-background";
import FooterSection from "@/components/ui/footer";

// Event showcase images from Unsplash
const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop", // Concert
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop", // Workshop
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop", // Tech event
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop", // Party
  "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&auto=format&fit=crop", // Music event
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop", // Conference
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop", // Networking
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop", // Business event
];

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const token = getAuthToken();
    
    // If user is NOT logged in, redirect to landing page
    if (!token) {
      router.push('/');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show loading while checking auth status
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background Layer */}
      <AuroraBackground className="fixed inset-0 -z-10">
        <div></div>
      </AuroraBackground>

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="flex justify-between items-center px-8 py-6">
            <Link href="/home" className="text-3xl tracking-tight whitespace-nowrap text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
              GroupBy
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/home" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm">
                Home
              </Link>
              <Link href="/events" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                Browse Events
              </Link>
              <Link href="/host" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                Host Event
              </Link>
              <ProfileButton />
            </nav>
          </div>
        </header>

        {/* Animated Hero Section */}
        <AnimatedMarqueeHero
          tagline=""
          title={
            <>
              Discover <span className="text-blue-600 dark:text-blue-400">Amazing Events</span>
              <br />
              Near You
            </>
          }
          description="From workshops to college fests, concerts to meetups. Find and join events that match your interests and connect with amazing people."
          images={EVENT_IMAGES}
        />

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}

