"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileCompletionForm from "@/components/ui/profile-completion-form";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { API_BASE_URL } from "@/lib/api";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user needs to complete profile
    const checkProfileStatus = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          // If user already has phone and city, redirect to home
          if (userData.phone && userData.location?.city) {
            router.push('/home');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkProfileStatus();
  }, [router]);

  const handleComplete = () => {
    router.push('/home');
  };

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
    <div className="relative w-full min-h-screen">
      {/* Aurora Background Layer */}
      <AuroraBackground className="fixed inset-0 -z-10">
        <div></div>
      </AuroraBackground>

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6">
          <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
            GroupBy
          </Link>
        </header>

        {/* Profile Completion Form Container */}
        <main className="relative w-full flex items-center justify-center min-h-screen p-4">
          <ProfileCompletionForm onComplete={handleComplete} />
        </main>
      </div>
    </div>
  );
}

