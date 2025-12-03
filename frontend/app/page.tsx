"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileButton } from "@/components/ui/profile-button";
import { getAuthToken } from "@/lib/api";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#F7F7F7]">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-8 py-5">
        <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
          GroupBy
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/events" className="text-gray-700 hover:text-black transition-colors">
              Discover
            </Link>
            <Link href="/host" className="text-gray-700 hover:text-black transition-colors">
              Host Event
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

      <main className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-[90px] left-[40px] w-[150px] h-[150px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=225&h=225&fit=crop" alt="" width={150} height={150} className="object-cover" />
        </div>

        <div className="absolute top-[230px] left-[170px] w-[170px] h-[170px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=255&h=255&fit=crop" alt="" width={170} height={170} className="object-cover" />
        </div>

        <div className="absolute top-[390px] left-[60px] w-[210px] h-[210px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=315&h=315&fit=crop" alt="" width={210} height={210} className="object-cover" />
        </div>

        <div className="absolute bottom-[150px] left-[200px] w-[185px] h-[220px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=278&h=330&fit=crop" alt="" width={185} height={220} className="object-cover" />
        </div>

        <div className="absolute bottom-[60px] left-[50px] w-[160px] h-[160px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=240&h=240&fit=crop" alt="" width={160} height={160} className="object-cover" />
        </div>

        <div className="absolute top-[90px] right-[40px] w-[150px] h-[150px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=225&h=225&fit=crop" alt="" width={150} height={150} className="object-cover" />
        </div>

        <div className="absolute top-[230px] right-[170px] w-[170px] h-[170px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=255&h=255&fit=crop" alt="" width={170} height={170} className="object-cover" />
        </div>

        <div className="absolute top-[390px] right-[60px] w-[210px] h-[210px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=315&h=315&fit=crop" alt="" width={210} height={210} className="object-cover" />
        </div>

        <div className="absolute bottom-[150px] right-[200px] w-[185px] h-[220px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=278&h=330&fit=crop" alt="" width={185} height={220} className="object-cover" />
        </div>

        <div className="absolute bottom-[60px] right-[50px] w-[160px] h-[160px] rounded-xl overflow-hidden shadow-lg">
          <Image src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=240&h=240&fit=crop" alt="" width={160} height={160} className="object-cover" />
        </div>

        <div className="relative z-50 max-w-5xl mx-auto px-12 text-center">
          <h1 className="mb-10" style={{ fontSize: '88px', fontWeight: '500', lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            <span className="text-black">Turn Your</span>
            <br />
            <span className="font-bold" style={{ color: '#0066FF' }}>Big Ideas</span>
            <br />
            <span className="text-black">Into Real Events</span>
          </h1>
          
          <p className="text-[22px] text-gray-800 max-w-3xl mx-auto mb-14 leading-relaxed" style={{ fontWeight: '400' }}>
            A comprehensive platform to help you discover local events and build meaningful connections, from finding workshops to hosting community gatherings
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/events"
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-md"
            >
              Discover Events
            </Link>
            
            <Link
              href="/host"
              className="bg-transparent hover:bg-gray-50 text-gray-800 px-12 py-4 rounded-full text-lg font-medium transition-all duration-150"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
