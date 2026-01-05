"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { GlassmorphismAuth } from "@/components/ui/glassmorphism-auth";
import Link from "next/link";

export default function LoginPage() {
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

        {/* Auth Form Container */}
        <main className="relative w-full flex items-center justify-center min-h-screen p-4">
          <GlassmorphismAuth />
        </main>
      </div>
    </div>
  );
}
