"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthToken } from "@/lib/api";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import FooterSection from "@/components/ui/footer";

// Event showcase images from Unsplash
const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=60", // Concert/music event
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=60", // Workshop/seminar
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&auto=format&fit=crop&q=60", // Tech/conference
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=60", // Party/social
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&auto=format&fit=crop&q=60", // College fest
  "https://images.unsplash.com/photo-1559223607-a43c990c3ddb?w=900&auto=format&fit=crop&q=60", // Outdoor event
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&auto=format&fit=crop&q=60", // Meetup/networking
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop&q=60", // Sports event
];

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  
  useEffect(() => {
    const token = getAuthToken();
    
    // If user is logged in, redirect to events page
    if (token) {
      router.push('/events');
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
      {/* Header */}
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

      {/* Hero Section with Animated Marquee */}
      <AnimatedMarqueeHero
        tagline="Join thousands of event enthusiasts"
        title={
          <>
            It&apos;s Time to Start
            <br />
            Your Next Event
          </>
        }
        description="Discover amazing events, connect with like-minded people, and create unforgettable experiences. From workshops to college fests, find everything happening around you."
        images={EVENT_IMAGES}
      />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
