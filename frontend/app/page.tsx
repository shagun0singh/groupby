"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileButton } from "@/components/ui/profile-button";
import { getAuthToken } from "@/lib/api";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoggedIn] = useState<boolean>(() => !!getAuthToken());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to signup/login with email
    window.location.href = `/login?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFA]">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-8 py-5">
        <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
          GroupBy
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/events" className="text-gray-700 hover:text-black transition-colors">
              Events
            </Link>
            <Link href="/host" className="text-gray-700 hover:text-black transition-colors">
              Host
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
                Login
              </Link>
            )}
          </nav>
          <ProfileButton />
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Discover college fests<br />with GroupBy
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connecting students with amazing college events and cultural festivals
            </p>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email"
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 text-base"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#D4FF00] hover:bg-[#C4EF00] text-black font-semibold rounded-lg transition-all"
              >
                Try for free
              </button>
            </form>
            <p className="text-sm text-gray-500">
              Connecting over 10,000 students and counting
            </p>
          </div>

          {/* Hero Image Section */}
          <div className="relative mt-16">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Main Demo Image */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Left Side - Student Images */}
                <div className="hidden lg:flex flex-col gap-4 p-6 bg-gray-50">
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                      alt="Students collaborating"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=400&fit=crop"
                      alt="College fest"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Center - Main Interface */}
                <div className="lg:col-span-1 p-8 bg-white">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h3 className="font-semibold text-lg">Event Registration</h3>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📧</span>
                        </div>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Fran Anderson</p>
                        <p className="text-gray-600 text-sm">I'd like to register for the fest #44433</p>
                      </div>
                    </div>

                    {/* AI Agent Response */}
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs">🤖</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-2">AI agent</p>
                        <p className="text-gray-600 text-sm mb-4">Hey Fran, which events would you like to register for?</p>
                        
                        {/* Event Cards */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="border rounded-lg p-2">
                            <div className="w-full h-16 bg-gray-200 rounded mb-2"></div>
                            <p className="text-xs font-medium">Dance Competition</p>
                            <button className="w-full mt-2 py-1 text-xs border rounded hover:bg-gray-50">Select</button>
                          </div>
                          <div className="border rounded-lg p-2 bg-black text-white">
                            <div className="w-full h-16 bg-gray-700 rounded mb-2"></div>
                            <p className="text-xs font-medium">Music Fest</p>
                            <button className="w-full mt-2 py-1 text-xs bg-white text-black rounded">Select</button>
                          </div>
                          <div className="border rounded-lg p-2">
                            <div className="w-full h-16 bg-gray-200 rounded mb-2"></div>
                            <p className="text-xs font-medium">Tech Summit</p>
                            <button className="w-full mt-2 py-1 text-xs border rounded hover:bg-gray-50">Select</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Order Details */}
                <div className="hidden lg:block p-8 bg-gray-50">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                      <div>
                        <p className="font-semibold">Fran Anderson</p>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">VIP</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Registration #44433</p>
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Confirmed
                        </span>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <p className="text-sm font-semibold">Events</p>
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <p className="text-sm font-semibold">Location</p>
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm font-semibold mb-3">AI agent chain of thought</p>
                        <div className="space-y-2">
                          {['Search knowledge', 'Retrieve event details', 'Verify eligibility', 'Confirm registration'].map((step, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">✓</span>
                              <span className="text-gray-600">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
